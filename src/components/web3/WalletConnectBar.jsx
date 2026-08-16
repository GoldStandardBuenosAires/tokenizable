
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePrivy } from '@privy-io/react-auth';
import { Cpu, Mail, ShieldCheck, TriangleAlert, Wallet } from 'lucide-react';
import { useActiveSigner } from '@/lib/web3/useActiveSigner';
import { getChainLabel } from '@/lib/web3/networks';

export default function WalletConnectBar() {
  const {
    isLocal,
    address,
    connected,
    wrongNetwork,
    targetChainId,
    deployment,
    deploymentError,
    switchToTarget,
  } = useActiveSigner();
  const { ready, authenticated, login, logout, user } = usePrivy();

  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';

  return (
    <div
      id="join_wallet_connect_bar"
      className="mb-10 border border-paper/10 bg-ash/60 clip-notch-tr p-6 md:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-px bg-spark" />
            <span className="text-lg font-mono uppercase tracking-widest text-spark">
              step 01 / identity
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-extralight text-paper mb-3">
            Connect a wallet, or start with just an email.
          </h3>
          <p className="text-lg text-paper/60 leading-relaxed">
            Membership settles on {getChainLabel(deployment?.chainId ?? targetChainId)}. Payment is
            taken in USDC or USDT and routed straight to the DAO treasury Safe — the mint contract
            never holds member funds.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4">
          {isLocal ? (
            <div className="flex items-center gap-3 border border-signal/40 bg-signal/5 px-5 py-4">
              <Cpu size={18} className="text-signal flex-shrink-0" />
              <div>
                <p className="text-lg text-paper">Local chain — no wallet needed</p>
                <p className="text-lg font-mono text-paper/50">
                  {short || 'connecting to the Hardhat node…'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <ConnectButton showBalance={false} chainStatus="icon" />
              {authenticated ? (
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 border border-paper/30 text-paper px-5 py-3 text-lg hover:border-spark hover:text-spark transition-colors"
                >
                  <Mail size={18} /> {user?.email?.address || 'Email wallet'} · sign out
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!ready}
                  onClick={login}
                  className="inline-flex items-center gap-2 border border-paper/30 text-paper px-5 py-3 text-lg hover:border-spark hover:text-spark transition-colors disabled:opacity-40"
                >
                  <Mail size={18} /> Continue with email
                </button>
              )}
            </div>
          )}

          {connected && !isLocal && (
            <p className="flex items-center gap-2 text-lg text-paper/50 font-mono">
              <Wallet size={16} className="text-spark" /> {short}
            </p>
          )}

          {wrongNetwork && (
            <button
              type="button"
              onClick={switchToTarget}
              className="inline-flex items-center gap-2 bg-spark text-ink px-5 py-3 text-lg hover:bg-paper transition-colors"
            >
              <TriangleAlert size={18} /> Wrong network · switch to{' '}
              {getChainLabel(targetChainId)}
            </button>
          )}
        </div>
      </div>

      {deploymentError ? (
        <p className="mt-6 border-l-2 border-spark pl-4 text-lg text-spark/90">{deploymentError}</p>
      ) : (
        <p className="mt-6 flex items-center gap-2 text-lg text-paper/40">
          <ShieldCheck size={16} className="text-signal" /> Treasury{' '}
          <span className="font-mono">{deployment?.treasuryAddress ?? '—'}</span>
        </p>
      )}
    </div>
  );
}
