'use client';

import React from 'react';

import parse from 'html-react-parser';

const RichTextViewer: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  return <div className='editor'>{parse(content)}</div>;
};

export default RichTextViewer;
