import React from "react";

const Footer = () => {
  return (
    <footer
      className="w-full border-t-4 border-border shadow-shadow bg-secondary-background p-3 flex flex-col gap-3 items-center text-center sm:flex-row sm:justify-center sm:text-left"
    >
      <p className="p-3 border-2 border-border shadow-shadow font-heading text-sm sm:text-base bg-main ">
        © {new Date().getFullYear()} deadlink-ap
      </p>


    </footer>
  );
};

export default Footer;
