function Footer() {
  return (
    <div className="w-full flex-col flex items-center py-16 lg:text-xl">
      <hr className="border-[#888888] py-4 w-[94%] lg:w-[97%]" />
      <h2 className="flex items-center lg:gap-2 gap-1 lg:py-2">
        Made with{" "}
        <span>
          <i
            className="ri-heart-3-fill lg:text-2xl text-xl text-[#ffffff]"
            style={{
              textShadow: "rgb(210, 175, 118) 0px 0px 20px",
            }}
          ></i>
        </span>{" "}
      </h2>
      <h1 className="flex items-center lg:gap-2 gap-1">
        by{" "}
        <span
          className="font-jose lg:text-5xl text-3xl md:text-4xl text-[#ffffff]"
          style={{
            textShadow: "rgb(210, 175, 118) 0px 0px 20px",
          }}
        >
          Ritik{" "}
        </span>
        <span className="w-3 h-3 bg-[#a33b3b] rounded-full lg:mt-3"></span>
      </h1>
      <h1 className="text-xs lg:text-sm text-[#999999] mt-2 lg:mt-4">
        Ritik singh © 2024. All rights reserved.
      </h1>
    </div>
  );
}

export default Footer;
