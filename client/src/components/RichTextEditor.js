import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Custom handler for the toolbar
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'strike', 'link', 'code'], // Basic text formatting tools
      [{ list: 'ordered' }, { list: 'bullet' }], // Lists (ordered & unordered)
      [{ align: [] }], // Text alignment
      ['blockquote', 'code-block'], // Blockquote & Code Block
      ['image', 'video'] // Image & Video embeds
    ],
    handlers: {
      image: function () {
        const url = prompt('Enter image URL');
        if (url) {
          const quill = this.quill;
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', url);
        }
      },
      video: function () {
        let url = prompt('Enter YouTube or other video URL');
        if (url) {
          const quill = this.quill;
          const range = quill.getSelection();
          
          // Convert YouTube URLs to embeddable format
          if (url.includes('watch?v=')) {
            url = url.replace('watch?v=', 'embed/');
          } else if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1];
            url = `https://www.youtube.com/embed/${videoId}`;
          }
          
          quill.insertEmbed(range.index, 'video', url);
        }
      }
    }
  }
};

const formats = [
  'header',
  'bold',
  'italic',
  'strike',
  'link',
  'code',
  'list', // Supports both ordered and bullet lists
  'bullet',
  'align', // Text alignment
  'blockquote', // Quotes
  'code-block', // Code blocks
  'image',
  'video'
];

const RichTextEditor = ({value, setValue, placeholderValue}) => {
//   const [value, setValue] = useState('');
  const quillRef = useRef(null);

  return (
    <div>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={setValue}
        ref={quillRef}
        placeholder={placeholderValue || "write here..."}
      />
    </div>
  );
};

export default RichTextEditor;
