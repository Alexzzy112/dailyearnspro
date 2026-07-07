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

const rankGradients = [
  'from-yellow-400 to-yellow-600',
  'from-gray-300 to-gray-500',
  'from-orange-400 to-orange-600',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
];

const rankColors = [
  'text-yellow-500 ring-yellow-400',
  'text-gray-400 ring-gray-300 dark:ring-gray-600',
  'text-orange-500 ring-orange-400',
  'text-blue-500 ring-blue-400',
  'text-purple-500 ring-purple-400',
];

export default function TopMembersPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/20 mb-4">
          <HiStar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Top Members</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Leading withdrawers this month</p>
      </MotionDiv>

      <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
        {topMembers.map((member, i) => (
          <MotionDiv key={member.rank} variants={staggerItem}>
            <div className={`card-pro p-5 ${member.rank === 1 ? 'ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-500/10' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`relative shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${rankGradients[i]} flex items-center justify-center shadow-lg ${rankColors[i].split(' ').slice(-1)}`}>
                  <span className="text-white text-xl font-black">{member.rank}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-secondary-700 dark:text-white truncate">{member.name}</h3>
                    <HiBadgeCheck className={`w-5 h-5 shrink-0 ${member.rank <= 3 ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'}`} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                    <span className="text-xl font-black text-accent-500">₦{member.amount.replace('₦', '')}</span>
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
                {member.rank === 1 && (
                  <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800">
                    <HiStar className="w-3.5 h-3.5" /> Top Withdrawer
                  </div>
                )}
              </div>
            </div>
          </MotionDiv>
        ))}
      </MotionDiv>

      <MotionDiv variants={fadeInUp(0.3)} initial="initial" animate="animate" className="mt-6 card-pro p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
          <HiStar className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Keep completing tasks and referring friends to climb the leaderboard!</p>
      </MotionDiv>
    </div>
  );
}
