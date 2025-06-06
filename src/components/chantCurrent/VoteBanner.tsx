type Props = {
  canVote: boolean;
  hasVoted: boolean;
  cooldown: number;
};

export default function VoteBanner({ canVote, hasVoted, cooldown }: Props) {
  return (
    <section className="fixed top-[280px] w-full max-w-md mx-auto px-4 z-10">
      <div className="text-black py-2 px-3 text-center font-bold text-sm flex justify-center items-center gap-2">
        今聞こえているチャントをタップ！
        <span className="text-xs font-normal">
          {!canVote ?
            `` :
            hasVoted ?
              `（残り${cooldown}秒）` :
              `（残り${cooldown}秒）`
          }
        </span>
      </div>
    </section>
  );
} 