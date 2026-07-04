'use client';
import { MotionDiv, staggerContainer, staggerItem, fadeInUp } from '@/components/MotionComponents';
import { HiStar, HiBadgeCheck, HiCalendar, HiCurrencyDollar } from 'react-icons/hi';

const topMembers = [
  { rank: 1, name: 'Tunde Balogun', amount: '₦12,450,000', withdrawals: 48, memberSince: '2024' },
  { rank: 2, name: 'Blessing Eze', amount: '₦8,920,000', withdrawals: 36, memberSince: '2024' },
  { rank: 3, name: 'Chioma Okonkwo', amount: '₦6,750,000', withdrawals: 29, memberSince: '2025' },
  { rank: 4, name: 'David Chukwu', amount: '₦5,380,000', withdrawals: 22, memberSince: '2024' },
  { rank: 5, name: 'Sarah Williams', amount: '₦4,100,000', withdrawals: 18, memberSince: '2025' },
];

const rankBgColors = ['bg-yellow-100 dark:bg-yellow-900/20', 'bg-gray-100 dark:bg-gray-700', 'bg-orange-100 dark:bg-orange-900/20', 'bg-gray-50 dark:bg-secondary-700/50', 'bg-gray-50 dark:bg-secondary-700/50'];
const rankIcons = [
  <div key={1} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
    <span className="text-white text-xl font-black">1</span>
  </div>,
  <div key={2} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg shadow-gray-400/30">
    <span className="text-white text-xl font-black">2</span>
  </div>,
  <div key={3} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
    <span className="text-white text-xl font-black">3</span>
  </div>,
  null, null,
];

export default function TopMembersPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/20 mb-4">
          <HiStar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Top Members</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Leading withdrawers this month</p>
      </MotionDiv>

      <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
        {topMembers.map((member, i) => (
          <MotionDiv key={member.rank} variants={staggerItem}>
            <div className={`relative bg-white dark:bg-secondary-800 rounded-2xl card-shadow overflow-hidden transition hover:shadow-lg ${member.rank === 1 ? 'ring-2 ring-yellow-400' : ''}`}>
              {member.rank === 1 && (
                <div className="absolute top-0 right-0">
                  <div className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-4 py-1 rounded-bl-xl">#1 TOP WITHDRAWER</div>
                </div>
              )}
              <div className="p-5 flex items-center gap-4">
                <div className={`relative flex-shrink-0 ${rankBgColors[i]} w-16 h-16 rounded-2xl flex items-center justify-center`}>
                  {rankIcons[i] || (
                    <span className="text-2xl font-black text-secondary-700 dark:text-white">{member.rank}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-secondary-700 dark:text-white truncate">{member.name}</h3>
                    <HiBadgeCheck className={`w-5 h-5 flex-shrink-0 ${member.rank <= 3 ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'}`} />
                  </div>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-xl font-black text-green-600">{member.amount}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <HiCurrencyDollar className="w-3.5 h-3.5" />
                      {member.withdrawals} withdrawals
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <HiCalendar className="w-3.5 h-3.5" />
                      Since {member.memberSince}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-center justify-center w-12">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Rank</div>
                  <div className={`text-2xl font-black ${member.rank === 1 ? 'text-yellow-500' : member.rank === 2 ? 'text-gray-400' : member.rank === 3 ? 'text-orange-600' : 'text-gray-300 dark:text-gray-500'}`}>
                    #{member.rank}
                  </div>
                </div>
              </div>
            </div>
          </MotionDiv>
        ))}
      </MotionDiv>

      <MotionDiv variants={fadeInUp(0.4)} initial="initial" animate="animate" className="mt-8 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
          <HiStar className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Keep completing tasks and referring friends to climb the leaderboard!</p>
      </MotionDiv>
    </div>
  );
}
