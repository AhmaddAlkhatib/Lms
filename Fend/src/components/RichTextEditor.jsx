import MDEditor from "@uiw/react-md-editor";

const RichTextEditor = ({ input, setInput }) => {
  const handleChange = (content) => {
    setInput({ ...input, description: content });
  };

  return (
    <MDEditor
      theme="snow"
      value={input.description}
      onChange={handleChange}
      height={130}
    />
  );
};

export default RichTextEditor;
