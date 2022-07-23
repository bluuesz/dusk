use anchor_lang::prelude::*;

use crate::constants::*;
use crate::state::*;

pub fn handler(ctx: Context<InitVault>) -> Result<()> {
  let vault = &mut ctx.accounts.vault;

  let vault_addr = vault.key();
  let streamer_addr = ctx.accounts.streamer.key();

  let seeds = &[VAULT_PDA_SEED, vault_addr.as_ref(), streamer_addr.as_ref()];

  let (vault_authority, vault_authority_bump) = Pubkey::find_program_address(seeds, ctx.program_id);

  vault.streamer = streamer_addr;
  vault.authority = vault_authority;
  vault.authority_seed = vault_addr;
  vault.authority_bump_seed = [vault_authority_bump];

  Ok(())
}

#[derive(Accounts)]
pub struct InitVault<'info> {
  #[account(mut)]
  pub streamer: Signer<'info>,

  #[account(
    init,
    seeds = [b"vault-streamer-account".as_ref(), streamer.key().as_ref()],
    bump,
    payer = streamer,
    space = 8 + std::mem::size_of::<Vault>())]
  pub vault: Account<'info, Vault>,

  pub system_program: Program<'info, System>,
}
