/* eslint-disable no-console */
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from '@solana/web3.js';
import { assert } from 'chai';
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

  it('Send donate', async () => {
    const donate = anchor.web3.Keypair.generate();

    const amount = new anchor.BN(2 * LAMPORTS_PER_SOL);

    const message = 'Alo, g?3?X? x x';

    await program.methods
      .sendDonate(message, amount)
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

    const donateAccount = await program.account.donate.fetch(donate.publicKey);

    assert.equal(feeBalance / LAMPORTS_PER_SOL, 0.04);
    assert.equal(streamerBalance / LAMPORTS_PER_SOL, 1.96);
    assert.equal(donateAccount.message, message);
  });

  it('Send donate with another wallet', async () => {
    const donate = anchor.web3.Keypair.generate();

    const wallet = anchor.web3.Keypair.generate();

    await fundWallet(program.provider.connection, wallet.publicKey, 4);

    const amount = new anchor.BN(3 * LAMPORTS_PER_SOL);

    const message = 'message';

    await program.methods
      .sendDonate(message, amount)
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

    const feeBalance = await program.provider.connection.getBalance(
      new PublicKey(feeAddress)
    );

    const donateAccount = await program.account.donate.fetch(donate.publicKey);

    assert.equal(feeBalance / LAMPORTS_PER_SOL, 0.1);
    assert.equal(streamerBalance / LAMPORTS_PER_SOL, 4.9);
    assert.equal(donateAccount.message, message);
  });

  it('Send donate with wrong feeAddress', async () => {
    const donate = anchor.web3.Keypair.generate();

    const feeAddressWrong = anchor.web3.Keypair.generate();

    const amount = new anchor.BN(2 * LAMPORTS_PER_SOL);

    const message = 'Alo, g?3?X? x x';

    try {
      await program.methods
        .sendDonate(message, amount)
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

    assert.equal(donates.length, 2);
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

    assert.equal(donates.length, 2);
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

    assert.equal(donates.length, 1);
  });
});
