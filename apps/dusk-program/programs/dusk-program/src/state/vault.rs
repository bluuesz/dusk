use anchor_lang::prelude::*;

#[account]
pub struct Vault {
  pub streamer: Pubkey,

  pub authority: Pubkey,

  pub authority_seed: Pubkey,

  pub authority_bump_seed: [u8; 1],

  /// amount of products on streamer store
  pub store_products_count: u64,
}
