use anchor_lang::prelude::*;
use instructions::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

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
