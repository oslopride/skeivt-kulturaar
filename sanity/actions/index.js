import defaultResolve, {
  DeleteAction,
} from "part:@sanity/base/document-actions";
import { approveExternalEventEditRequestAction } from "./workflow/approveExternalEventRequestAction";
import { declineExternalEventEditRequestAction } from "./workflow/declineExternalEventRequestAction";

export default function resolveDocumentActions(props) {
  if (props.type === "eventRequest") {
    return [
      approveExternalEventEditRequestAction,
      DeleteAction,
      declineExternalEventEditRequestAction,
    ];
  }

  return [...defaultResolve(props)];
}
