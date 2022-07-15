use anchor_lang::prelude::*;
use instructions::*;

declare_id!("STmfvCbGpVhf68bLjG61RQPEVVtmG4Ge6MNLt9PwFHc");

pub mod instructions;
pub mod state;

#[program]
pub mod dusk_program {
  use super::*;

  pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
    Ok(())
  }

  pub fn send_donate(ctx: Context<SendDonate>, message: String, amount: u64) -> Result<()> {
    instructions::send_donate::handler(ctx, message, amount)
  }
}

#[derive(Accounts)]
pub struct Initialize {}
