'use client';
import Link from 'next/link';
import Image from 'next-image-export-optimizer';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  UserIcon, ChevronRightIcon, ChevronLeftIcon, XCircleIcon, PhotoIcon,
} from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'motion/react';

import {
  fetchAvlbUsns, fetchAvlbAvts, fetchAvlbAvtsMore, updateMeEditor, updateMeData,
} from '@/actions/chunk';
import { LoadingIcon } from '@/components/Icons';
import { dialogBgFMV, dialogFMV } from '@/types/animConfigs';
import {
  getMeEdtrAvtWthObj, getAvlbAvtsWthObj, getAvlbAvtsHasMore,
} from '@/selectors';
import { isString, isFldStr } from '@/utils';

import { useSafeAreaFrame } from '.';
import LogoBns from '../images/logo-bns.png';

const mdlFMV = {
  hidden: {
    translateX: '-20%',
    transition: { ease: 'easeOut', duration: 0.2 },
  },
  visible: {
    translateX: '0%',
    transition: { ease: 'easeIn', duration: 0.2 },
  },
};

const rgtOtrFMV = /** @type {any} */ ({
  hidden: {
    transition: { when: 'afterChildren' },
    visibility: 'hidden',
  },
  visible: {
    visibility: 'visible',
  },
});

const rgtInrFMV = {
  hidden: {
    translateX: '100%',
    transition: { ease: 'easeIn', duration: 0.2 },
  },
  visible: {
    translateX: '0%',
    transition: { ease: 'easeOut', duration: 0.2 },
  },
};

export function MeEditorPopup() {
  const { height: safeAreaHeight } = useSafeAreaFrame();
  const username = useSelector(state => state.meEditor.username);
  const avtWthObj = useSelector(state => getMeEdtrAvtWthObj(state));
  const bio = useSelector(state => state.meEditor.bio);
  const renderCode = useSelector(state => state.meEditor.renderCode);
  const didFthAvlbUsns = useSelector(state => state.meEditor.didFthAvlbUsns);
  const avlbUsns = useSelector(state => state.meEditor.avlbUsns);
  const didFthAvlbAvts = useSelector(state => state.meEditor.didFthAvlbAvts);
  const avlbAvtsWthObj = useSelector(state => getAvlbAvtsWthObj(state));
  const avlbAvtsHasMore = useSelector(state => getAvlbAvtsHasMore(state));
  const fthgAvlbAvtsMore = useSelector(state => state.meEditor.fthgAvlbAvtsMore);
  const saving = useSelector(state => state.meEditor.saving);
  const didClick = useRef(false);
  const dispatch = useDispatch();

  const isShown = isString(username) && isString(avtWthObj.str) && isString(bio);

  const onCancelBtnClick = () => {
    dispatch(updateMeEditor({ username: null, avatar: null, bio: null }));
  };

  const onFthAvlbAvtsRtBtnClick = () => {
    dispatch(fetchAvlbAvts(true, true));
  };

  const onFthgAvlbAvtsMoreRtBtnClick = () => {
    dispatch(fetchAvlbAvtsMore(true));
  };

  const onFthAvlbUsnsRtBtnClick = () => {
    dispatch(fetchAvlbUsns(true, true));
  };

  const onSvRtBtnClick = () => {

  };

  const onFthgAvlbAvtsMoreBtnClick = () => {
    dispatch(fetchAvlbAvtsMore());
  };

  const onAvtSltBtnClick = (str) => {
    dispatch(updateMeEditor({ renderCode: null, avatar: str }));
  };

  const onAvlbAvtsAnimCmpt = () => {
    dispatch(fetchAvlbAvts());
  }

  const onUsnSltBtnClick = (str) => {
    dispatch(updateMeEditor({ renderCode: null, username: str }));
  };

  const onAvlbUsnsAnimCmpt = () => {
    dispatch(fetchAvlbUsns());
  }

  const onToEdtrBtnClick = () => {
    dispatch(updateMeEditor({ renderCode: null }));
  };

  const onAvtRmBtnClick = () => {
    dispatch(updateMeEditor({ avatar: '' }));
  };

  const onToAvlbAvtsBtnClick = () => {
    dispatch(updateMeEditor({ renderCode: 2 }));
  };

  const onUsnRmBtnClick = () => {
    dispatch(updateMeEditor({ username: '' }));
  };

  const onToAvlbUsnsBtnClick = () => {
    dispatch(updateMeEditor({ renderCode: 1 }));
  };

  const onBioChange = (evt) => {
    dispatch(updateMeEditor({ bio: evt.target.value }));
  };

  const onSaveBtnClick = () => {
    if (didClick.current) return;
    dispatch(updateMeData());
    didClick.current = true;
  };

  useEffect(() => {
    if (isShown) didClick.current = false;
  }, [isShown, saving]);

  const renderLdgPane = () => {
    if (saving !== true) return null;

    return (
      <>
        <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <LoadingIcon className="relative size-10 animate-spin stroke-slate-500 text-slate-300" />
        </div>
      </>
    );
  };

  const renderAvtsPane = () => {
    let content;
    if (didFthAvlbAvts === null) {
      content = (
        <>
          <div className="h-1/3" />
          <div className="mx-auto ball-clip-rotate-blk">
            <div />
          </div>
          <p className="mt-6 text-center text-base text-slate-400">Retrieving NFTs associated with your STX address.</p>
        </>
      );
    } else if (didFthAvlbAvts === false) {
      content = (
        <>
          <div className="h-1/3" />
          <p className="text-red-600 text-center">Something went wrong! Please wait and try again.</p>
          <button onClick={onFthAvlbAvtsRtBtnClick} className="block mt-3 mx-auto rounded-full bg-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:brightness-110">Retry</button>
        </>
      );
    } else if (avlbAvtsWthObj.length === 0) {
      content = (
        <>
          <div className="h-1/4" />
          <PhotoIcon className="mx-auto size-24 text-slate-500" />
          <p className="text-center text-base text-slate-200">No NFTs</p>
          <p className="mt-2 text-center text-base text-slate-400">You can grab one by sending it to this address or buying it from a marketplace like <Link className="hover:underline" href="https://gamma.io">Gamma.io</Link>.</p>
        </>
      );
    } else {
      content = (
        <>
          <p className="mt-6 text-left text-sm text-slate-400">Select one of your NFTs to use as your avatar.</p>
          <div className="mt-6 grid grid-cols-2 gap-6">
            {avlbAvtsWthObj.map(({ str, obj }) => {
              return (
                <button key={str} className="flex flex-col items-center justify-start group" onClick={() => onAvtSltBtnClick(str)}>
                  <Image className="size-24 rounded-full" width={96} height={96} src={obj.thumbnail} alt="" unoptimized={true} placeholder="empty" />
                  <p className="mt-2 text-sm text-slate-400 group-hover:text-slate-300 line-clamp-3 w-full">{obj.collection}</p>
                </button>
              );
            })}
          </div>
        </>
      );
    }

    let moreContent = null;
    if (fthgAvlbAvtsMore === false) {
      moreContent = (
        <div className="my-6 text-center">
          <p className="text-center text-base text-red-600">Something went wrong! Please wait and try again.</p>
          <button onClick={onFthgAvlbAvtsMoreRtBtnClick} className="mt-3 rounded-full bg-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:brightness-110">Retry</button>
        </div>
      );
    } else if (fthgAvlbAvtsMore === true) {
      moreContent = (
        <div className="my-3 flex items-center justify-center">
          <div className="lds-ellipsis">
            <div className="bg-slate-400"></div>
            <div className="bg-slate-400"></div>
            <div className="bg-slate-400"></div>
            <div className="bg-slate-400"></div>
          </div>
        </div>
      );
    } else if (avlbAvtsHasMore === true) {
      moreContent = (
        <div className="my-6 text-center">
          <button onClick={onFthgAvlbAvtsMoreBtnClick} className="w-full max-w-xs rounded-full border border-slate-500 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-400 hover:border-slate-400 hover:text-slate-300 sm:w-auto">More</button>
        </div>
      );
    }

    return (
      <motion.div className="absolute inset-0 overflow-hidden" variants={rgtOtrFMV} initial={false} animate={renderCode === 2 ? 'visible' : 'hidden'} onAnimationComplete={onAvlbAvtsAnimCmpt}>
        <motion.div className="h-full w-full bg-slate-800 flex flex-col" variants={rgtInrFMV}>
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
            <div className="relative">
              <h3 className="text-center text-2xl font-medium leading-6 text-slate-100">NFTs</h3>
              <button className="absolute left-0 top-0 group -translate-x-3 -translate-y-2" onClick={onToEdtrBtnClick}>
                <ChevronLeftIcon className="size-10 text-slate-400 group-hover:text-slate-300" />
              </button>
            </div>
            {content}
            {moreContent}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderUsnsPane = () => {
    let content;
    if (didFthAvlbUsns === null) {
      content = (
        <>
          <div className="h-1/3" />
          <div className="mx-auto ball-clip-rotate-blk">
            <div />
          </div>
          <p className="mt-6 text-center text-base text-slate-400">Retrieving BNS names associated with your STX address.</p>
        </>
      );
    } else if (didFthAvlbUsns === false) {
      content = (
        <>
          <div className="h-1/3" />
          <p className="text-red-600 text-center">Something went wrong! Please wait and try again.</p>
          <button onClick={onFthAvlbUsnsRtBtnClick} className="block mt-3 mx-auto rounded-full bg-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:brightness-110">Retry</button>
        </>
      );
    } else if (avlbUsns.length === 0) {
      content = (
        <>
          <div className="h-1/5" />
          <Image className="mx-auto size-24 rounded-full" width={96} height={96} src={LogoBns} alt="" />
          <p className="text-center text-base text-slate-200">No BNS names</p>
          <p className="mt-2 text-center text-base text-slate-400">You can grab one by sending it to this address or buying it from a marketplace like <Link className="hover:underline" href="https://bns.one">bns.one</Link>.</p>
        </>
      );
    } else {
      content = (
        <>
          <p className="mt-6 text-left text-sm text-slate-400">Select one of your BNS names to use as your username.</p>
          <div className="mt-4">
            {avlbUsns.map((str, i) => {
              return (
                <div key={str} className="flex flex-col items-stretch">
                  {i !== 0 && <div className="h-px bg-slate-700 my-2" />}
                  <button className="-mx-2 px-2 rounded-md block py-2 group hover:bg-slate-700" onClick={() => onUsnSltBtnClick(str)}>
                    <p className="text-left text-xl text-slate-300 group-hover:text-slate-200 truncate">{str}</p>
                  </button>
                </div>
              );
            })}
          </div>
        </>
      );
    }

    return (
      <motion.div className="absolute inset-0 overflow-hidden" variants={rgtOtrFMV} initial={false} animate={renderCode === 1 ? 'visible' : 'hidden'} onAnimationComplete={onAvlbUsnsAnimCmpt}>
        <motion.div className="h-full w-full bg-slate-800 flex flex-col" variants={rgtInrFMV}>
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
            <div className="relative">
              <h3 className="text-center text-2xl font-medium leading-6 text-slate-100">BNS names</h3>
              <button className="absolute left-0 top-0 group -translate-x-3 -translate-y-2" onClick={onToEdtrBtnClick}>
                <ChevronLeftIcon className="size-10 text-slate-400 group-hover:text-slate-300" />
              </button>
            </div>
            {content}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderEdtrPane = () => {
    let avatarPane, usernamePane;
    if (isFldStr(avtWthObj.obj.thumbnail)) {
      avatarPane = (
        <div className="relative rounded-full border-2 border-slate-800">
          <Image className="size-28 rounded-full" width={112} height={112} src={avtWthObj.obj.thumbnail} alt="User avatar" unoptimized={true} placeholder="empty" />
          <button className="absolute top-0 right-0 group p-2 translate-x-1 -translate-y-1" onClick={onAvtRmBtnClick}>
            <div className="bg-slate-800 rounded-full">
              <XCircleIcon className="size-6 text-slate-400/85 group-hover:text-slate-300/85" />
            </div>
          </button>
        </div>
      );
    } else {
      avatarPane = (
        <div className="rounded-full border-2 border-slate-700 p-2">
          <UserIcon className="size-24 text-slate-700" />
        </div>
      );
    }
    if (isFldStr(username)) {
      usernamePane = (
        <div className="mt-1 flex">
          <div className="relative min-w-0">
            <p className="text-3xl text-slate-200 truncate mr-7">{username}</p>
            <button className="absolute top-0 right-0 group p-2 translate-x-0.5 -translate-y-3.5" onClick={onUsnRmBtnClick}>
              <div className="bg-slate-800 rounded-full">
                <XCircleIcon className="size-6 text-slate-400/85 group-hover:text-slate-300/85" />
              </div>
            </button>
          </div>
        </div>
      );
    } else {
      usernamePane = (
        <p className="mt-1 text-3xl text-slate-200">N/A</p>
      );
    }

    return (
      <motion.div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6" variants={mdlFMV} initial={false} animate={[1, 2].includes(renderCode) ? 'hidden' : 'visible'}>
        <h3 className="text-left text-2xl font-medium leading-6 text-slate-100">Edit profile</h3>
        <div className="my-6 relative">
          <p className="text-sm text-slate-400">Avatar</p>
          <div className="mt-2 flex items-center justify-center">
            {avatarPane}
          </div>
          <button className="absolute right-0 inset-y-0 px-2 group -mr-4 pt-5" onClick={onToAvlbAvtsBtnClick}>
            <ChevronRightIcon className="size-10 text-slate-400 group-hover:text-slate-300" />
          </button>
        </div>
        <div className="h-px bg-slate-700" />
        <div className="flex items-stretch justify-start">
          <div className="grow shrink my-6 min-w-0">
            <p className="text-sm text-slate-400">Username</p>
            {usernamePane}
          </div>
          <button className="grow-0 shrink-0 px-2 group -mr-4 pt-5" onClick={onToAvlbUsnsBtnClick}>
            <ChevronRightIcon className="size-10 text-slate-400 group-hover:text-slate-300" />
          </button>
        </div>
        <div className="h-px bg-slate-700" />
        <div className="mt-6">
          <p className="text-sm text-slate-400">Bio</p>
          <textarea className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-700 px-2.5 py-1.5 text-base text-slate-200 min-h-24 placeholder:text-slate-400 focus:outline-none" value={bio} onChange={onBioChange} />
        </div>
        <div className="mt-6 flex justify-stretch space-x-2">
          <button onClick={onSaveBtnClick} className="w-full rounded-full bg-orange-400 px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110">Save</button>
          <button onClick={onCancelBtnClick} className="w-full rounded-full bg-slate-600 px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110">Cancel</button>
        </div>
      </motion.div>
    );
  };

  if (!isShown) return <AnimatePresence key="AP_MEP" />;

  const panelHeight = Math.min(584, safeAreaHeight * 0.9);

  return (
    <AnimatePresence key="AP_MEP">
      <div className="fixed inset-0 overflow-hidden z-20">
        <div className="flex items-center justify-center p-4" style={{ minHeight: safeAreaHeight }}>
          <div className="fixed inset-0">
            {/* No cancel on background of MeEditorPopup */}
            <motion.button className="absolute inset-0 size-full cursor-default bg-black/25 focus:outline-none" variants={dialogBgFMV} initial="hidden" animate="visible" exit="hidden" />
          </div>
          <motion.div className="relative flex flex-col w-full max-w-xs overflow-hidden rounded-lg bg-slate-800 ring-1 ring-white/25" style={{ height: panelHeight }} variants={dialogFMV} initial="hidden" animate="visible" exit="hidden" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
            {renderEdtrPane()}
            {renderUsnsPane()}
            {renderAvtsPane()}
            {renderLdgPane()}
          </motion.div>
        </div>
      </div >
    </AnimatePresence>
  );
}
