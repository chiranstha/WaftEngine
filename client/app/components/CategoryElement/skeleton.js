import React from 'react';
import Skeleton from 'react-loading-skeleton';

const Loading = () => (
  <>
    <h2 className="pt-5 pb-5">
      <Skeleton height={20} width={300} />
    </h2>
    <div className="recent_blog">
      {[1, 2, 3].map((each, index) => (
        <div key={each} className={`mr-4 ${index === 0 ? 'first_item' : ''}`}>
          <div className="flex max-w-sm mb-5">
            <Skeleton height={80} width={100} className="imgContainer" />

            <div className="pl-5">
              <Skeleton height={10} width={100} />
              <div className="font-bold text-xl block text-black hover:text-waftprimary heading pointer no-underline">
                <Skeleton count={Math.floor(Math.random() * 2) + 1} width={500} />
              </div>
              <span className="text-gray-700 text-sm sans-serif">
                <Skeleton height={10} width={150} />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default Loading;
