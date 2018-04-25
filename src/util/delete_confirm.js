import Confirm from "react-confirm-bootstrap";

export class ConfirmAction extends React.Component{
    onConfirm() {

    },

    render() {
        return (
            <Confirm
                onConfirm={this.onConfirm}
                body="Are you sure you want to delete this?"
                confirmText="Confirm Delete"
                title="Deleting Stuff">
                <button>Delete Stuff</button>
            </Confirm>
        )
    },
};
