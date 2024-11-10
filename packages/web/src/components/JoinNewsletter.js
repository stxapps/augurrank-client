'use client';
import { useState } from 'react';

import { ADD_NEWSLETTER_EMAIL_URL, VALID } from '@/types/const';

const STATUS_INIT = 'STATUS_INIT';
const STATUS_JOINING = 'STATUS_JOINING';
const STATUS_INVALID = 'STATUS_INVALID';
const STATUS_COMMIT = 'STATUS_COMMIT';
const STATUS_ROLLBACK = 'STATUS_ROLLBACK';

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getMsg(status) {
  if (status === STATUS_JOINING) return 'Joining...';
  if (status === STATUS_INVALID) return 'Invalid email format. Please try again.';
  if (status === STATUS_COMMIT) return 'Thank you for joining. We\'ll deliver valuable updates to your inbox.';
  if (status === STATUS_ROLLBACK) return 'Please wait a bit and try again. If the issue persists, please get in touch with us.';
  return '';
}

export function JoinNewsletter() {

  const [state, setState] = useState({ status: STATUS_INIT, email: '', extraMsg: '' });

  const onEmailInputChange = async (e) => {
    setState({ status: STATUS_INIT, email: e.target.value, extraMsg: '' });
  };

  const onJoinBtnClick = async () => {
    if (!validateEmail(state.email)) {
      setState(state => ({ ...state, status: STATUS_INVALID, extraMsg: '' }));
      return;
    }

    setState(state => ({ ...state, status: STATUS_JOINING, extraMsg: '' }));
    try {
      const res = await fetch(ADD_NEWSLETTER_EMAIL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'strict-origin',
        body: JSON.stringify({ email: state.email }),
      });
      if (!res.ok) {
        const extraMsg = res.statusText;
        setState(state => ({ ...state, status: STATUS_ROLLBACK, extraMsg }));
        return;
      }

      const json = await res.json();
      if (json.status !== VALID) {
        const extraMsg = 'Invalid reqBody or email';
        setState(state => ({ ...state, status: STATUS_ROLLBACK, extraMsg }));
        return;
      }

      setState(state => ({ ...state, status: STATUS_COMMIT, extraMsg: '' }));
    } catch (error) {
      const extraMsg = error.message;
      setState(state => ({ ...state, status: STATUS_ROLLBACK, extraMsg }));
    }
  };

  return (
    <div className="px-7 pt-10">
      <p className="text-xl font-medium text-slate-100">Stay up to date</p>
      <p className="mt-2.5 text-sm text-slate-400">Get notified when we have something new, and unsubscribe at any time.</p>
      <input className="mt-5 block w-full rounded-full border border-slate-700 bg-slate-700 px-4 py-1.5 text-sm text-slate-200 placeholder:text-slate-400 focus:outline focus:outline-orange-400" onChange={onEmailInputChange} type="email" autoComplete="email" placeholder="Email address" value={state.email} autoCapitalize="none" disabled={[STATUS_JOINING, STATUS_COMMIT].includes(state.status)} />
      <div className="min-h-[5.25rem] pb-1.5 pt-3">
        {[STATUS_INIT, STATUS_INVALID, STATUS_ROLLBACK].includes(state.status) && <button onClick={onJoinBtnClick} className="rounded-full bg-orange-400 px-4 py-1.5 text-sm font-semibold text-white" disabled={[STATUS_JOINING, STATUS_COMMIT].includes(state.status)}>Join</button>}
        {[STATUS_INVALID, STATUS_ROLLBACK].includes(state.status) && <p className="pt-1.5 text-sm text-red-500">{getMsg(state.status)}</p>}
        {([STATUS_ROLLBACK].includes(state.status) && state.extraMsg) && <p className="pt-1.5 text-sm text-red-500">{state.extraMsg}</p>}
        {[STATUS_JOINING].includes(state.status) && <div className="mt-1 flex">
          <div className="ball-clip-rotate-blk">
            <div />
          </div>
          <p className="ml-2 text-sm text-slate-300">{getMsg(state.status)}</p>
        </div>}
        {[STATUS_COMMIT].includes(state.status) && <p className="mt-1 text-sm font-medium text-green-500">{getMsg(state.status)}</p>}
      </div>
    </div>
  );
}
