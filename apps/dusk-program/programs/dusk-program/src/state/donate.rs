use anchor_lang::prelude::*;

#[error_code]
pub enum DonateErrorCode {
  #[msg("The message should be 360 characters long maximum.")]
  MessageTooLong,
  #[msg("Invalid fee address provided.")]
  InvalidFeeAddressProvided,
}

#[account]
pub struct Donate {
  pub user: Pubkey,
  pub streamer_address: Pubkey,

  pub username: Option<String>,

  pub message: String,

  // token used for donation
  pub spl_token: Pubkey,
  pub amount: u64,

  pub timestamps: i64,
}
