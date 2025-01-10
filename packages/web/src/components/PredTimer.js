'use client';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { isNumber } from '@/utils';

const getSecs = (targetBurnHeight, burnHeight, randomNumber) => {
  if (!isNumber(targetBurnHeight) || !isNumber(burnHeight)) return null;
  return ((targetBurnHeight - burnHeight) * 10 * 60) - Math.floor(randomNumber * 59);
};

export function PredTimer(props) {
  const { targetBurnHeight } = props;
  const burnHeight = useSelector(state => state.gameBtc.burnHeight);
  const rdnbRef = useRef(Math.random());
  const [secs, setSecs] = useState(
    getSecs(targetBurnHeight, burnHeight, rdnbRef.current)
  );

  useEffect(() => {
    setSecs(getSecs(targetBurnHeight, burnHeight, rdnbRef.current));
    rdnbRef.current = Math.random();
    const timeId = setInterval(() => {
      setSecs(v => isNumber(v) ? v - 1 : v);
    }, 1000);

    return () => {
      clearInterval(timeId);
    };
  }, [targetBurnHeight, burnHeight, setSecs]);

  if (!isNumber(secs)) return null;

  const dsecs = Math.max(0, secs);
  const h = Math.floor(dsecs / 60 / 60);
  const m = Math.floor((dsecs - (h * 60 * 60)) / 60);
  const s = dsecs - (h * 60 * 60) - (m * 60);

  const [mm, ss] = [`${m}`.padStart(2, '0'), `${s}`.padStart(2, '0')];

  return (
    <>
      ~<span className="font-mono text-base">{h}</span><span className="text-sm">h</span> <span className="font-mono text-base">{mm}</span><span className="text-sm">m</span> <span className="font-mono text-base">{ss}</span><span className="text-sm">s</span> left
    </>
  );
}
