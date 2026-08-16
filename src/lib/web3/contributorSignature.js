
/**
 * Contributor mints are gated by an EIP-712 approval signed by the DAO's allowlist
 * signer (core-team multisig today, DAO vote later). That signer lives OFF-chain, so
 * this function must call a real signer service before Contributor minting can work.
 *
 * It intentionally throws. Faking, stubbing out, or bypassing the signature check
 * would make the free mint permissionless and spammable — never do that.
 *
 * Expected shape once the endpoint exists:
 *   POST /api/contributor-approval { address }
 *   -> { signature: "0x...", nonce: "12", expiry: "1767225600" }
 */
export async function getContributorSignature(/* address */) {
  throw new Error(
    'Contributor minting is not yet connected to the DAO signer service. An allowlist signature (signature + nonce + expiry) must be issued by the core-team multisig signer before this mint can be submitted.'
  );
}
