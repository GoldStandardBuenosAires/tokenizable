
import React, { useState } from 'react';
import { CircleDollarSign, Coins, ExternalLink, Loader, TriangleAlert } from 'lucide-react';
import Magnet from '@/components/ui/magnet';
import { useMintFlow } from '@/lib/web3/useMintFlow';
import { getExplorerTxUrl } from '@/lib/web3/networks';

const LABELS = ['Mint now', 'Request contributor access', 'Become a patron'];

export default function MintPanel({ tierIndex }) {
  const [currency, setCurrency] = useState('usdc');
  const {
    isLocal,
    connected,
    wrongNetwork,
    deploymentError,
    status,
    step,
    error,
    result,
    paidMint,
    contributorMint,
    fundLocalBalances,
    switchToTarget,
  } = useMintFlow();

  const isPaid = tierIndex !== 1;
  const tier = tierIndex === 0 ? 'founding' : tierIndex === 2 ? 'patron' : 'contributor';
  const busy = status === 'working';
  const mineResult = result && result.tier === tier ? result : null;
  const mineError = error && (busy === false) ? error : '';
  const blocked = !connected || Boolean(deploymentError) || wrongNetwork;

  const run = async () => {
    try {
      if (isPaid) await paidMint({ tier, currency });
      else await contributorMint();
    } catch {
      /* surfaced inline below */
    }
  };

  return (
    <div id={`join_mint_panel_${tier}`} className="mt-auto">
      {isPaid && (
        <div className="flex gap-2 mb-4">
          {[
            { id: 'usdc', label: 'USDC · 1 tx', icon: CircleDollarSign },
            { id: 'usdt', label: 'USDT · 2 tx', icon: Coins },
          ].map((option) => {
            const Icon = option.icon;
            const active = currency === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setCurrency(option.id)}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-3 text-lg border transition-colors ${
                  active
                    ? 'border-spark text-spark bg-spark/10'
                    : 'border-paper/15 text-paper/50 hover:border-paper/40'
                }`}
              >
                <Icon size={16} /> {option.label}
              </button>
            );
          })}
        </div>
      )}

      <Magnet padding={60}>
        <button
          type="button"
          onClick={run}
          disabled={busy || blocked}
          className={`w-full py-4 text-lg font-medium transition-colors inline-flex items-center justify-center gap-2 ${
            tierIndex === 0
              ? 'bg-spark text-ink hover:bg-paper'
              : 'border border-paper/30 text-paper hover:border-spark hover:text-spark'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {busy && <Loader size={18} className="animate-spin" />}
          {busy ? 'Working…' : LABELS[tierIndex]}
        </button>
      </Magnet>

      {isLocal && isPaid && (
        <button
          type="button"
          onClick={fundLocalBalances}
          disabled={busy}
          className="w-full mt-3 py-3 text-lg text-signal border border-signal/30 hover:bg-signal/10 transition-colors disabled:opacity-40"
        >
          Fund local test balance
        </button>
      )}

      {busy && step && <p className="mt-4 text-lg text-paper/60 font-mono">{step}</p>}

      {!connected && !deploymentError && (
        <p className="mt-4 text-lg text-paper/40">Connect a wallet or email above to mint.</p>
      )}

      {wrongNetwork && (
        <button
          type="button"
          onClick={switchToTarget}
          className="mt-4 inline-flex items-center gap-2 text-lg text-spark"
        >
          <TriangleAlert size={16} /> Switch network to continue
        </button>
      )}

      {deploymentError && (
        <p className="mt-4 border-l-2 border-spark pl-4 text-lg text-spark/90">{deploymentError}</p>
      )}

      {mineError && (
        <p className="mt-4 border-l-2 border-spark pl-4 text-lg text-spark/90">{mineError}</p>
      )}

      {mineResult && (
        <div className="mt-4 border border-signal/40 bg-signal/5 p-4">
          <p className="text-lg text-paper">
            Minted · {tier} membership + {mineResult.tknAmount} TKN
          </p>
          <p className="mt-1 text-lg font-mono text-paper/50 break-all">{mineResult.txHash}</p>
          {mineResult.vestingWallet && (
            <p className="mt-2 text-lg text-paper/60 break-all">
              Vesting wallet <span className="font-mono">{mineResult.vestingWallet}</span> — 10,000
              TKN release linearly over 365 days.
            </p>
          )}
          {getExplorerTxUrl(mineResult.chainId, mineResult.txHash) ? (
            <a
              href={getExplorerTxUrl(mineResult.chainId, mineResult.txHash)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-lg text-spark hover:text-paper transition-colors"
            >
              <ExternalLink size={16} /> View on PolygonScan
            </a>
          ) : (
            <p className="mt-3 text-lg text-paper/40">
              Local chain — no public explorer. Check the chain logs in your terminal.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
