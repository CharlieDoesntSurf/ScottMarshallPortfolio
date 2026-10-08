import { ReactNode } from "react";

interface IPhoneFrameProps {
  children: ReactNode;
}

export function IPhoneFrame({ children }: IPhoneFrameProps) {
  return (
    <div className="relative">
      {/* iPhone 17 Pro Max Frame */}
      <div className="relative w-[393px] h-[852px] bg-black rounded-[60px] shadow-2xl p-3">
        {/* Inner bezel */}
        <div className="relative w-full h-full bg-white rounded-[48px] overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-50"></div>

          {/* Screen Content */}
          <div className="w-full h-full bg-slate-950 overflow-hidden">
            {children}
          </div>
        </div>
      </div>

      {/* Power Button */}
      <div className="absolute right-0 top-[200px] w-1 h-[80px] bg-black rounded-l-sm"></div>

      {/* Volume Buttons */}
      <div className="absolute left-0 top-[180px] w-1 h-[50px] bg-black rounded-r-sm"></div>
      <div className="absolute left-0 top-[245px] w-1 h-[50px] bg-black rounded-r-sm"></div>
    </div>
  );
}
