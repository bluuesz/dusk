use anchor_lang::prelude::*;
use anchor_spl::{
  associated_token::AssociatedToken,
  token::{Mint, Token, TokenAccount},
};

use crate::state::*;

pub fn handler(ctx: Context<CreateCoin>, _bump_authority: u8, name: String) -> Result<()> {
  let coin_account = &mut ctx.accounts.coin_account;
  let streamer = &ctx.accounts.streamer;
  
  // let token_account_addr = &ctx.accounts.coin_token_account;


  coin_account.name = name;
  coin_account.streamer = streamer.key();
  // coin_account.token_account = token_account_addr.key();

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
    mint::freeze_authority = authority,
  )]
  pub coin_mint: Account<'info, Mint>,

  // #[account(init,   
  //   associated_token::mint = coin_mint,
  //   associated_token::authority = streamer,
  //   payer = streamer
  // )]
  // pub coin_token_account: Box<Account<'info, TokenAccount>>, 

  #[account(init, seeds = [b"streamer-coin-acc", streamer.key().as_ref()], bump, payer = streamer, space = 8+std::mem::size_of::<Coin>())]
  pub coin_account: Account<'info, Coin>,

  pub associated_token_program: Program<'info, AssociatedToken>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub rent: Sysvar<'info, Rent>
}
