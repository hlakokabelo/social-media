import * as React from "react";
import { useEffect } from "react";
import CommunityList from "../../components/community/CommunityList";

interface ICommunitiesPageProps {}

const CommunitiesPage: React.FunctionComponent<ICommunitiesPageProps> = () => {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  

  return (
    <div className="">
      <h2 className="text-4xl font-bold mb-6 text-center text-slate-400">
        Communities
      </h2>
      <CommunityList />
    </div>
  );
};

export default CommunitiesPage;
