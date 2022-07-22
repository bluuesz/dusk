use anchor_lang::prelude::*;

#[account]
pub struct Coin {
  pub name: String,

  // streamer who created this token
  pub streamer: Pubkey,

  pub token_account: Pubkey,
}
