'use client';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

import { updateErrorPopup } from '@/actions';
import { isFldStr } from '@/utils';

export function ErrorPopup() {

  const title = useSelector(state => state.display.errorPopupTitle);
  const body = useSelector(state => state.display.errorPopupBody);
  const didClick = useRef(false);
  const dispatch = useDispatch();

  const isShown = isFldStr(title) && isFldStr(body);

  const onCancelBtnClick = () => {
    if (didClick.current) return;
    didClick.current = true;
    dispatch(updateErrorPopup({ title: null, body: null }));
  };

  useEffect(() => {
    if (isShown) didClick.current = false;
  }, [isShown]);

  if (!isShown) return null;

  return (
    <div className="fixed inset-x-0 top-14 flex items-start justify-center md:top-0">
      <div className="relative m-4 rounded-md bg-red-50 p-4 shadow-lg">
        <div className="flex">
          <div className="shrink-0">
            <ExclamationCircleIcon className="size-6 text-red-400" />
          </div>
          <div className="ml-3 lg:mt-0.5">
            <h3 className="text-left text-base font-medium text-red-800 lg:text-sm">{title}</h3>
            <p className="mt-2.5 text-sm text-red-700">{body}</p>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button onClick={onCancelBtnClick} className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 transition duration-150 ease-in-out hover:bg-red-100 focus:bg-red-100 focus:outline-none">Ok</button>
              </div>
            </div>
          </div>
        </div>
        <button onClick={onCancelBtnClick} className="absolute right-1 top-1 rounded-md bg-red-50 p-1 hover:bg-red-100 focus:bg-red-100 focus:outline-none" type="button">
          <span className="sr-only">Dismiss</span>
          <svg className="size-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
