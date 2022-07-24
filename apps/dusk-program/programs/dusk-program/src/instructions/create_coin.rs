use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::{
  associated_token::AssociatedToken,
  token::{Mint, Token, MintTo, TokenAccount},
};

use crate::state::*;
use crate::constants::*;

impl<'info> CreateCoin<'info> {
  fn mint_to_dusk_wallet(&self, amount: u64) -> Result<()> {
    let vault = &self.vault;

    let cpi_accounts = MintTo {
      mint: self.coin_mint.to_account_info(),
      to: self.coin_token_account.to_account_info(),
      authority: self.authority.to_account_info(),
    };


    let cpi_program = self.token_program.to_account_info();

    let seeds = [VAULT_PDA_SEED, vault.authority_seed.as_ref(), &vault.streamer.as_ref(), &vault.authority_bump_seed];


    token::mint_to(CpiContext::new(cpi_program, cpi_accounts).with_signer(&[&seeds]), amount)?;

    Ok(())
  }
}

pub fn handler(ctx: Context<CreateCoin>, _bump_authority: u8, name: String) -> Result<()> {
  let coin_account = &mut ctx.accounts.coin_account;
  let streamer = &mut ctx.accounts.streamer;
  
  coin_account.name = name;
  coin_account.streamer = streamer.key();


  // mint 90kk
  ctx.accounts.mint_to_dusk_wallet(9000000000000)?;

  Ok(())
}

#[derive(Accounts)]
#[instruction(bump_authority: u8)]
pub struct CreateCoin<'info> {
  #[account(mut)]
  pub streamer: Signer<'info>,

  #[account(mut, has_one = authority)]
  pub vault: Box<Account<'info, Vault>>,

  /// CHECK:
  #[account(seeds = [&VAULT_PDA_SEED, vault.key().as_ref(), streamer.key().as_ref()], bump = bump_authority)]
  pub authority: AccountInfo<'info>,

  #[account(init, seeds = [b"streamer-coin-mint", streamer.key().as_ref()], bump, payer = streamer,
    mint::decimals = 5, 
    mint::authority = authority,
    mint::freeze_authority = DUSK_WALLET_ADDRESS.parse::<Pubkey>().unwrap(),
  )]
  pub coin_mint: Account<'info, Mint>,

  /// CHECK
  #[account(constraint = dusk_wallet.key() == DUSK_WALLET_ADDRESS.parse::<Pubkey>().unwrap())]
  pub dusk_wallet: AccountInfo<'info>,

  #[account(init_if_needed,   
    associated_token::mint = coin_mint,
    associated_token::authority = dusk_wallet,
    payer = streamer
  )]
  pub coin_token_account: Box<Account<'info, TokenAccount>>, 

  #[account(init, seeds = [b"streamer-coin-acc", streamer.key().as_ref()], bump, payer = streamer, space = 8+std::mem::size_of::<Coin>())]
  pub coin_account: Account<'info, Coin>,

  pub associated_token_program: Program<'info, AssociatedToken>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub rent: Sysvar<'info, Rent>
}
