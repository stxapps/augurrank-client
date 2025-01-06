import Link from 'next/link';
import Image from 'next-image-export-optimizer';

import { CONTRACT_ADDR, GAME_BTC_CONTRACT_NAME } from '@/types/const';
import { GameBtcPrice } from '@/components/GameBtcPrice';
import { GameBtcPred } from '@/components/GameBtcPred';
import LogoBtc from '@/images/logo-btc.svg';

export function GameBtc() {

  return (
    <main className="relative mx-auto max-w-2xl overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 py-20">
      <div className="flex flex-col items-center justify-start sm:flex-row sm:justify-center">
        <div className="rounded-full border-2 border-slate-800 p-2">
          <Image className="size-32" src={LogoBtc} alt="" />
        </div>
        <div className="mt-6 sm:ml-6 sm:mt-0">
          <h1 className="text-center text-5xl font-medium text-white sm:text-left">Bitcoin</h1>
          <p className="mt-3 text-center text-xl text-slate-400 sm:text-left">Your vision on Bitcoin price</p>
        </div>
      </div>
      <div className="mt-10 rounded-xl bg-slate-800/75 mx-auto max-w-sm overflow-hidden">
        <div className="px-7 pt-10 pb-8">
          <p className="text-base text-slate-200">Challenge yourself to envision the future of Bitcoin price, store your predictions on the chain, and brag about your accuracy forever.</p>
        </div>
        <div className="h-px bg-slate-700" />
        <GameBtcPrice />
        <div className="h-px bg-slate-700" />
        <GameBtcPred />
      </div>
      <div className="prose prose-invert prose-a:text-slate-300 prose-a:no-underline hover:prose-a:underline mx-auto mt-10 text-slate-400">
        <h4 id="Details" className="text-slate-300">Details</h4>
        <ol className="list-disc">
          <li>Choose "Up" if you want to predict that the BTC price at the following 100 Bitcoin blocks will be more than the BTC price at the Bitcoin block that stores your prediction via the Stacks blockchain.</li>
          <li>Choose "Down" if you want to predict that the BTC price at the following 100 Bitcoin blocks will be less than the BTC price at the Bitcoin block that stores your prediction via the Stacks blockchain.</li>
          <li>Usually, your prediction will be stored within five seconds after you confirm it on your Stacks wallet. However, the five seconds cannot be guaranteed. It can take longer depending on network congestion, network fees, etc.</li>
          <li>Your prediction is stored on the <Link href="https://explorer.hiro.so" target="_blank" rel="noreferrer">Stacks blockchain</Link> by calling our <Link href={`https://explorer.hiro.so/txid/${CONTRACT_ADDR}.${GAME_BTC_CONTRACT_NAME}?chain=mainnet`} target="_blank" rel="noreferrer">smart contract</Link> with your Stacks wallet, and the hash value of every Stacks block is automatically stored on the Bitcoin blockchain by the Stacks protocol.</li>
          <li>The price shown is for suggestions only. It's approximate, not real-time, and is not the price used to verify the prediction outcome. </li>
          <li>After the target Bitcoin block reaches, we verify the prediction outcome by calling the smart contract with the correct Stacks block height corresponding to the target Bitcoin block and the Bitcoin block that stores your prediction. The smart contract fetches the Bitcoin price at the specific block from the <Link href="https://explorer.hiro.so/txid/SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.amm-pool-v2-01" target="_blank" rel="noreferrer">ALEX AMM pools</Link>, compares prices, and stores the outcome.</li>
          <li>The reference Bitcoin prices are from the ALEX AMM pools at the specific Bitcoin block. The first Stacks block is used when multiple Stacks blocks exist for a particular Bitcoin block.</li>
          <li>There are two fees: a service fee and a network fee. We charge a service fee of 0.1 STX per prediction to maintain and improve our app and services. The Stacks network fee is charged by Stacks miners for storing your prediction on the Stacks blockchain. It varies depending on miners, network congestion, etc.</li>
          <li>You pay both fees when you confirm on your Stacks wallet. We cannot undo it after confirmation. We do not refund the service fee, and we cannot refund the Stacks network fee.</li>
          <li>The possible outcomes are TRUE, FALSE, and N/A.</li>
          <li>
            The possible outcome is TRUE if:
            <ol className="list-[lower-alpha]">
              <li>You predict "Up", and the BTC price at the following 100 Bitcoin blocks is equal to or more than the BTC price at the Bitcoin block that stores your prediction.</li>
              <li>You predict "Down", and the BTC price at the following 100 Bitcoin blocks is equal to or less than the BTC price at the Bitcoin block that stores your prediction.</li>
            </ol>
          </li>
          <li>
            The possible outcome is FALSE if:
            <ol className="list-[lower-alpha]">
              <li>You predict "Up", and the BTC price at the following 100 Bitcoin blocks is less than the BTC price at the Bitcoin block that stores your prediction.</li>
              <li>You predict "Down", and the BTC price at the following 100 Bitcoin blocks is more than the BTC price at the Bitcoin block that stores your prediction.</li>
            </ol>
          </li>
          <li>
            The possible outcome is N/A if:
            <ol className="list-[lower-alpha]">
              <li>With the following 100 Bitcoin blocks from the block that stores your prediction, that Bitcoin block doesn't have any corresponding Stacks blocks, so we cannot reference prices from the ALEX AMM pools at that block.</li>
            </ol>
          </li>
          <li>Only one in-anticipation prediction is allowed. You can make one prediction at a time. You must wait for the current one to reach the target Bitcoin block before making another prediction.</li>
        </ol>
        <h4 id="Disclaimers" className="text-slate-300">Disclaimers</h4>
        <ol className="list-disc">
          <li>BTC prices from ALEX AMM pools might differ from those from other sources, such as <Link href="https://coinmarketcap.com/currencies/bitcoin/" target="_blank" rel="noreferrer">CoinMarketCap</Link> or <Link href="https://www.coingecko.com/en/coins/bitcoin" target="_blank" rel="noreferrer">CoinGecgo</Link>. Our smart contract references the price from ALEX AMM pools only and as is.</li>
          <li>The prediction outcome from our smart contract is final, even if it works incorrectly. We cannot modify published smart contracts, so we cannot fix the outcome. We'll do our best to deploy a fixed version and use it instead, but existing outcomes cannot be changed.</li>
          <li>In case of unexpected events that make our smart contract unable to verify or output the outcome, we will do our best to fix it. If not, the outcome will be N/A.</li>
          <li>This is a game, not a bet. You won't lose money if you're wrong and don't get money if you're right. Either way, we charge you a small fee to store and verify your prediction on a blockchain.</li>
        </ol>
        <p>You agree to our <Link href="/game-btc#Details" prefetch={false}>Game Details</Link>, <Link href="/game-btc#Disclaimers" prefetch={false}>Disclaimers</Link>, <Link href="/terms" prefetch={false}>Terms of Service</Link>, and <Link href="/privacy" prefetch={false}>Privacy policy</Link>. We'll do our best to be fair, transparent, community-driven, and fun. You agree to accept our final decisions. You agree we can change our Game Details, Disclaimers, Terms of Service, and Privacy policy if necessary.</p>
      </div>
    </main>
  );
}
