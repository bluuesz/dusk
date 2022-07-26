use crate::state::*;
use anchor_lang::prelude::*;

use crate::constants::*;

impl<'info> SendDonate<'info> {
  fn send_donate(&self, amount: u64) -> Result<()> {
    let fee_address = &self.fee_address;
    let streamer_address = &self.streamer_address;
    let from_address = &self.payer;

    let fees = ((amount as f32) * FEE_PERCENT) as u64;
    let amount_after_fees = amount - fees;

    msg!(
      "fee amount {} and amount_after_fees {}",
      fees,
      amount_after_fees
    );

    let ixs = anchor_lang::solana_program::system_instruction::transfer_many(
      &self.payer.key(),
      &[
        (streamer_address.key(), amount_after_fees),
        (fee_address.key(), fees),
      ],
    );

    for ix in ixs {
      anchor_lang::solana_program::program::invoke(
        &ix,
        &[
          from_address.to_account_info(),
          streamer_address.to_account_info(),
          fee_address.to_account_info(),
        ],
      )?;
    }

    Ok(())
  }
}

pub fn handler(
  ctx: Context<SendDonate>,
  message: String,
  amount: u64,
  username: Option<String>,
) -> Result<()> {
  let donate = &mut ctx.accounts.donate;
  let user = &ctx.accounts.payer;

  let streamer_address = &ctx.accounts.streamer_address;

  let clock = Clock::get().unwrap();

  if message.chars().count() > 255 {
    return Err(DonateErrorCode::MessageTooLong.into());
  }

  match username {
    Some(username) => donate.username = Some(username),
    None => donate.username = None,
  }
  donate.message = message;
  donate.user = user.key();
  donate.timestamps = clock.unix_timestamp;
  donate.streamer_address = streamer_address.key();
  donate.amount = amount;

  ctx.accounts.send_donate(amount)?;

  Ok(())
}

#[derive(Accounts)]
pub struct SendDonate<'info> {
  #[account(init, payer = payer, space = 8 + std::mem::size_of::<Donate>())]
  pub donate: Account<'info, Donate>,

  #[account(mut)]
  pub payer: Signer<'info>,

  /// CHECK:
  #[account(mut, constraint = fee_address.key() == FEE_ADDRESS.parse::<Pubkey>().unwrap() @ DonateErrorCode::InvalidFeeAddressProvided)]
  pub fee_address: AccountInfo<'info>,

  /// CHECK:
  #[account(mut)]
  pub streamer_address: AccountInfo<'info>, // todo: change to vault

  pub system_program: Program<'info, System>,
}
