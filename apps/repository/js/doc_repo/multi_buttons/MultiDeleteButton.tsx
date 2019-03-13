import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {SimpleTooltip} from '../../../../../web/js/ui/tooltip/SimpleTooltip';
import {ConfirmPrompts} from '../../../../../web/js/ui/confirm/ConfirmPrompts';

export class MultiDeleteButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (<div>

            <Button id="multi-delete-button"
                    size="sm"
                    color="light"
                    className="border"
                    onClick={() => this.onClick()}>

                <span className="text-danger">
                    <i className="fas fa-trash-alt"></i>
                </span>

            </Button>

            <SimpleTooltip target="multi-delete-button"
                           placement="bottom">

                Delete multiple documents at once.

            </SimpleTooltip>

        </div>);

    }

    private onClick() {

        ConfirmPrompts.create({
            target: '#multi-delete-button',
            title: "Are you sure you want to delete these documents?",
            subtitle: "This is a permanent operation and can't be undone.",
            placement: 'bottom',
            onCancel: () => this.props.onCancel(),
            onConfirm: () => this.props.onConfirm(),
        });

    }

}

interface IProps {
    readonly onCancel: () => void;
    readonly onConfirm: () => void;
}

interface IState {
}
