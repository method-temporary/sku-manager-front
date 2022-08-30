import React from 'react';
import './previewModal.css';

interface TestInfoViewProps {
  title: string;
  description: string;
  authorName: string;
}

export function TestInfoView({ title, description, authorName }: TestInfoViewProps) {
  return (
    <>
      <div>
        <span>
          시험지 이름
          <strong>{title}</strong>
        </span>
        <span>
          출제자 이름
          <strong>{authorName}</strong>
        </span>
      </div>
      <div>
        <span>
          시험지 설명
          <strong>{description}</strong>
        </span>
      </div>
    </>
  );
}
