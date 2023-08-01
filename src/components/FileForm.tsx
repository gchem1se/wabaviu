import { forwardRef, ForwardedRef, ChangeEvent } from "react";

const FileForm = forwardRef(function FileForm(
  props: {onChange: (event: ChangeEvent) => unknown},
  ref: ForwardedRef<HTMLInputElement>
) {
  return <input type="file" onChange={props.onChange} ref={ref}></input>;
});

export default FileForm;
