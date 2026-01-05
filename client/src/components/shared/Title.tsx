import React, { type FC } from "react";
import { Helmet } from "react-helmet-async";

interface TitleProps {
  title?: string;
  description?: string;
}

const Title: FC<TitleProps> = ({
  title = "KarloBaat",
  description = "This is chat app called KarloBaat",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
