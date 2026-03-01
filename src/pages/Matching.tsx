/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Avatar } from '../components/Avatar';
import { UserData, UserProfile } from '../types';

interface MatchingProps {
  userData: UserData;
  profile: UserProfile;
}

export const Matching = ({ userData, profile }: MatchingProps) => {
  return (
    <motion.div 
      key="matching"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="z-10 text-center"
    >
      <div className="relative mb-8 flex justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 border-4 border-dashed border-cloud-blue rounded-full absolute"
        />
        <div className="w-48 h-48 flex items-center justify-center">
          <Avatar type="animal" color={userData.avatar.color} head={userData.avatar.head ?? 'head1'} clothes={userData.avatar.clothes ?? 'clothes1'} size="md" />
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-2">Finding your partner...</h2>
      <p className="text-cloud-muted">Looking for someone who prefers {profile.preference} study.</p>
    </motion.div>
  );
};
