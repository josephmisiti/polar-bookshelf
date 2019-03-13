import * as React from 'react';
import {Tag} from '../../../web/js/tags/Tag';
import {TagsDB} from './TagsDB';
import Select from 'react-select';
import {Blackout} from '../../../web/js/ui/blackout/Blackout';
import {TagSelectOptions} from './TagSelectOptions';
import {TagSelectOption} from './TagSelectOption';
import {FilteredTags} from './FilteredTags';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import Button from 'reactstrap/lib/Button';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
// import {SyntheticKeyboardEvent} from 'react-dom';

const Styles: IStyleMap = {

    dropdownChevron: {

        display: 'inline-block',
        width: 0,
        height: 0,
        marginLeft: '.255em',
        verticalAlign: '.255em',
        borderTop: '.3em solid',
        borderRight: '.3em solid transparent',
        borderBottom: 0,
        borderLeft: '.3em solid transparent',
        color: 'var(--secondary)'

    }

};

export class FilterTagInput extends React.PureComponent<IProps, IState> {

    private readonly id: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            popoverOpen: false,
            defaultValue: []
        };

        this.id = this.props.id || "filter-tag-input";

    }

    public render() {
        //
        const options: TagSelectOption[] =
            this.props.tagsDBProvider().tags().map( current => {
                return {
                    value: current.id,
                    label: current.label
                };
        });

        return (

            <div>

                <Button color="light"
                        id={this.id}
                        size="sm"
                        disabled={this.props.disabled}
                        onClick={() => this.toggle()}

                        className="header-filter-clickable p-1 pl-2 pr-2 border">

                    <i className="fa fa-tag doc-button doc-button-selectable mr-1"/>
                    Tags

                    <div style={Styles.dropdownChevron}></div>

                </Button>

                <Popover placement="bottom"
                         isOpen={this.state.popoverOpen}
                         target={this.id}
                         trigger="legacy"
                         toggle={() => this.toggle()}
                         className="tag-input-popover">

                    <PopoverBody className="shadow">

                        <div className="pt-1 pb-1">
                            <strong>Filter documents by tag:</strong>
                        </div>

                        <Select
                            escapeClearsValue
                            isMulti
                            isClearable
                            autoFocus
                            onKeyDown={event => this.onKeyDown(event)}
                            className="filter-tag-input"
                            classNamePrefix="select"
                            onChange={this.handleChange}
                            defaultValue={this.state.defaultValue}
                            options={options}
                        />

                    </PopoverBody>

                </Popover>

            </div>

        );

    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key.toLowerCase() === "escape") {
            this.toggle();
        }

        if (event.getModifierState("Control") && event.key.toLowerCase() === "enter") {
            this.toggle();
        }

    }

    private toggle() {

        this.state = {
            ...this.state,
            popoverOpen: !this.state.popoverOpen
        };

        Blackout.toggle(this.state.popoverOpen);

        this.setState(this.state);

    }

    private handleChange(selectedOptions: any) {

        // as so as we handle the change we toggle off

        this.toggle();

        const defaultValue: TagSelectOptions[] = selectedOptions;

        this.state = Object.assign(this.state, {
            defaultValue
        });

        this.props.filteredTags.set(TagSelectOptions.toTags(selectedOptions));

        this.props.refresher();

        this.setState(this.state);

    }

}

interface IProps {

    readonly id?: string;

    readonly disabled?: boolean;

    readonly tagsDBProvider: () => TagsDB;

    readonly refresher: () => void;

    readonly filteredTags: FilteredTags;

}

interface IState {
    readonly popoverOpen: boolean;
    readonly defaultValue: TagSelectOption[];
}

