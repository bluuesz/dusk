use anchor_lang::prelude::*;
use instructions::*;

declare_id!("STmfvCbGpVhf68bLjG61RQPEVVtmG4Ge6MNLt9PwFHc");

pub mod constants;
pub mod instructions;
pub mod state;

#[program]
pub mod dusk_program {
  use super::*;

  pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
    Ok(())
  }

  pub fn init_vault(ctx: Context<InitVault>) -> Result<()> {
    instructions::init_vault::handler(ctx)
  }

  pub fn send_donate(ctx: Context<SendDonate>, message: String, amount: u64) -> Result<()> {
    instructions::send_donate::handler(ctx, message, amount)
  }

  pub fn create_coin(ctx: Context<CreateCoin>, bump_authority: u8, name: String) -> Result<()> {
    instructions::create_coin::handler(ctx, bump_authority, name)
  }
}

#[derive(Accounts)]
pub struct Initialize {}
