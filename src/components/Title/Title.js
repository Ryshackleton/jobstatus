import React, { useEffect, useReducer } from 'react';

export const stateReducer = (state, action) => {
  switch(action.type) {
    case 'SET_TITLE':
      return { ...state, titleString: action.payload };
    default:
      throw new Error('Invalid action type in Title.stateReducer()');
  }
};

export default function Title({
  className,
  fetchTitlePromise,
}) {
  const [state, dispatch] = useReducer(stateReducer, {
    titleString: '',
  });

  // fetch initial metadata and state
  useEffect(() => {
    async function fetchData() {
      dispatch({ type: 'SET_TITLE', payload: await fetchTitlePromise() });
    };
    fetchData();
  }, []);

  return <h2 className={className}>{state.titleString}</h2>;
};
