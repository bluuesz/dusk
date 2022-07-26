/* eslint-disable no-console */
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { assert } from 'chai';
import { DUSK_WALLET_ADDRESS } from '@dusk/utils';
import { DuskProgram } from '../target/types/dusk_program';
import { fundWallet } from '../utils/fund-wallet';

describe('dusk-program', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  // global state
  const program = anchor.workspace.DuskProgram as Program<DuskProgram>;

  const payer = anchor.web3.Keypair.generate();
  const streamerAddress = anchor.web3.Keypair.generate();
  const feeAddress = '2jUqAgmPpytRXyhtWH5xanAjqU4esVWHk9FhYkKkU9uv';

  before('fund wallet', async () => {
    await fundWallet(program.provider.connection, payer.publicKey, 50);
  });

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log('Your transaction signature', tx);
  });

  it('Send donate without username', async () => {
    const donate = anchor.web3.Keypair.generate();

    const message = 'Alo, g?3?X? x x';

    const amount = new anchor.BN(2 * LAMPORTS_PER_SOL);

    await program.methods
      .sendDonate(message, amount, null)
      .accounts({
        donate: donate.publicKey,
        feeAddress,
        payer: payer.publicKey,
        streamerAddress: streamerAddress.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer, donate])
      .rpc();

    const streamerBalance = await program.provider.connection.getBalance(
      streamerAddress.publicKey
    );

    const feeBalance = await program.provider.connection.getBalance(
      new PublicKey(feeAddress)
    );

    console.log({
      streamerBalance,
      feeBalance,
    });

    const donateAccount = await program.account.donate.fetch(donate.publicKey);

    assert.equal(donateAccount.message, message);
    assert.equal(donateAccount.username, null);
    assert.equal(streamerBalance / LAMPORTS_PER_SOL, 1.96);
    assert.equal(feeBalance / LAMPORTS_PER_SOL, 0.04);
  });

  it('Send donate with username', async () => {
    const donate = anchor.web3.Keypair.generate();

    const message = 'Alo, g?3?X? x x';

    const amount = new anchor.BN(2 * LAMPORTS_PER_SOL);

    await program.methods
      .sendDonate(message, amount, 'bluuesz')
      .accounts({
        donate: donate.publicKey,
        feeAddress,
        payer: payer.publicKey,
        streamerAddress: streamerAddress.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer, donate])
      .rpc();

    const streamerBalance = await program.provider.connection.getBalance(
      streamerAddress.publicKey
    );

    const feeBalance = await program.provider.connection.getBalance(
      new PublicKey(feeAddress)
    );

    console.log({
      streamerBalance,
      feeBalance,
    });

    const donateAccount = await program.account.donate.fetch(donate.publicKey);

    assert.equal(donateAccount.message, message);
    assert.equal(donateAccount.username, 'bluuesz');
    assert.equal(streamerBalance / LAMPORTS_PER_SOL, 3.92);
    assert.equal(feeBalance / LAMPORTS_PER_SOL, 0.08);
  });

  it('Send donate with another wallet', async () => {
    const donate = anchor.web3.Keypair.generate();

    const wallet = anchor.web3.Keypair.generate();

    await fundWallet(program.provider.connection, wallet.publicKey, 4);

    const amount = new anchor.BN(3 * LAMPORTS_PER_SOL);

    const message = 'message';

    await program.methods
      .sendDonate(message, amount, null)
      .accounts({
        donate: donate.publicKey,
        feeAddress,
        payer: wallet.publicKey,
        streamerAddress: streamerAddress.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([wallet, donate])
      .rpc();

    const streamerBalance = await program.provider.connection.getBalance(
      streamerAddress.publicKey
    );

    const donateAccount = await program.account.donate.fetch(donate.publicKey);

    assert.equal(streamerBalance / LAMPORTS_PER_SOL, 6.86);
    assert.equal(donateAccount.message, message);
  });

  it('Send donate with wrong feeAddress', async () => {
    const donate = anchor.web3.Keypair.generate();

    const feeAddressWrong = anchor.web3.Keypair.generate();

    const amount = new anchor.BN(2 * LAMPORTS_PER_SOL);

    const message = 'Alo, g?3?X? x x';

    try {
      await program.methods
        .sendDonate(message, amount, null)
        .accounts({
          donate: donate.publicKey,
          feeAddress: feeAddressWrong.publicKey,
          payer: payer.publicKey,
          streamerAddress: streamerAddress.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer, donate])
        .rpc();
    } catch ({ error }) {
      assert.equal(error.errorMessage, 'Invalid fee address provided.');
    }
  });

  it('get all donates', async () => {
    const donates = await program.account.donate.all();

    assert.equal(donates.length, 3);
  });

  it('get donations received by streamer', async () => {
    const donates = await program.account.donate.all([
      {
        memcmp: {
          offset: 8 + 32, // descriminator + userpubkey
          bytes: streamerAddress.publicKey.toBase58(),
        },
      },
    ]);

    assert.equal(donates.length, 3);
  });

  it('get donations send by user', async () => {
    const donates = await program.account.donate.all([
      {
        memcmp: {
          offset: 8, // descriminator
          bytes: payer.publicKey.toBase58(),
        },
      },
    ]);

    assert.equal(donates.length, 2);
  });

  it('init vault', async () => {
    const [vault, vaultBump] = await PublicKey.findProgramAddress(
      [Buffer.from('vault-streamer-account'), payer.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .initVault()
      .accounts({
        vault,
        streamer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    const vaultAccount = await program.account.vault.fetch(vault);

    assert.ok(vaultAccount.streamer.toBase58(), payer.publicKey.toBase58());
  });

  it('create coin', async () => {
    const [vault, vaultBump] = await PublicKey.findProgramAddress(
      [Buffer.from('vault-streamer-account'), payer.publicKey.toBuffer()],
      program.programId
    );

    const [vaultAuthority, vaultAuthorityBump] =
      await PublicKey.findProgramAddress(
        [
          Buffer.from('streamer-vault'),
          vault.toBuffer(),
          payer.publicKey.toBuffer(),
        ],
        program.programId
      );

    const [coinAcc] = await PublicKey.findProgramAddress(
      [Buffer.from('streamer-coin-acc'), payer.publicKey.toBuffer()],
      program.programId
    );

    const [coinMint] = await PublicKey.findProgramAddress(
      [Buffer.from('streamer-coin-mint'), payer.publicKey.toBuffer()],
      program.programId
    );

    const coinTokenAccount = await getAssociatedTokenAddress(
      coinMint,
      DUSK_WALLET_ADDRESS
    );

    await program.methods
      .createCoin(vaultAuthorityBump, 'G3X Coin')
      .accounts({
        authority: vaultAuthority,
        coinAccount: coinAcc,
        coinMint,
        duskWallet: DUSK_WALLET_ADDRESS,
        coinTokenAccount,
        streamer: payer.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        vault,
      })
      .signers([payer])
      .rpc();

    const coin = await program.provider.connection.getTokenSupply(coinMint);
    const duskTokenAccountBalance =
      await program.provider.connection.getTokenAccountBalance(
        coinTokenAccount
      );

    console.log({
      duskTokenAccountBalance,
    });

    assert.equal(coin.value.decimals, 5);
  });
});
