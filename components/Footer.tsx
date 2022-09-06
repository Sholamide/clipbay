import React from "react";
import { footerList1, footerList2, footerList3 } from "../utils/constants";

const List = ({ items, mt }: { items: string[]; mt: boolean }) => (
  <div className={`flex flex-wrap gap-2 ${mt && "mt-5"}`}>
    {items.map((item) => (
      <p key={item} className="hover:underline text-gray-400 text-sm">
        {item}
      </p>
    ))}
  </div>
);
const Footer = () => {
  return (
    <div className="mt-6 hidden xl:block">
      <List items={footerList1} mt={false} />
      <List items={footerList2} mt />
      <List items={footerList3} mt />
      <p className="text-sm mt-5 text-gray-400">
        {new Date().getFullYear()} CLIPBAY
      </p>
      <p className="text-sm mt-5 text-gray-400">
        Built with ❤️ by{" "}
        <a
          className="text-red-600 hover:underline italic font-bold"
          target="_blank"
          href="https://twitter.com/lordolamider"
        >
          Lordie
        </a>
      </p>
    </div>
  );
};

export default Footer;
