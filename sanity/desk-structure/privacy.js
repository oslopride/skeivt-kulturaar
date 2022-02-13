import S from "@sanity/desk-tool/structure-builder";
import EditIcon from "part:@sanity/base/edit-icon";
import { MdPrivacyTip } from "react-icons/md";

export default S.listItem()
	.title("Privacy Policy")
	.icon(MdPrivacyTip)
	.child(
		S.document()
			.title("Privacy Policy")
			.id("privacy")
			.schemaType("privacy")
			.documentId("global_privacy")
			.views([
				S.view.form().icon(EditIcon),
			])
	);
