use anchor_lang::prelude::*;

pub const MAX_MESSAGE_LENGTH: usize = 360 * 4; // 360 chars
pub const FEE_ADDRESS: &str = "2jUqAgmPpytRXyhtWH5xanAjqU4esVWHk9FhYkKkU9uv";
pub const FEE_PERCENT: f32 = 0.02;

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

  pub message: String,

  // token used for donation
  pub spl_token: Pubkey,
  pub amount: u64,

  pub timestamps: i64,
}
