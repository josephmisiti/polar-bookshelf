import * as React from 'react';
import {DeepPureComponent} from '../../react/DeepPureComponent';
import {TreeNodeChildren} from './TreeNodeChildren';
import Button from 'reactstrap/lib/Button';
import {Dictionaries} from '../../util/Dictionaries';
import {isPresent} from '../../Preconditions';
import {Preconditions} from '../../Preconditions';
import {TreeState} from './TreeView';
import {TNode} from './TreeView';
import {NullCollapse} from '../null_collapse/NullCollapse';

class Styles {

    public static NODE_PARENT: React.CSSProperties = {
        display: 'flex',
        paddingTop: '2px'
    };

    public static NODE_ICON: React.CSSProperties = {
        display: 'block',
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: '0px',
        fontSize: '12px',
        lineHeight: '1.5',
        color: 'var(--secondary)',
        cursor: 'pointer',
        userSelect: 'none',
        // this has to be fixed width or each layer doesn't line up.
        width: '12px',
        // height: '20px'
    };

    public static NODE_NAME: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: '2px',
        fontSize: '15px',
        lineHeight: '1.5',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        paddingRight: '5px',
        fontFamily: 'sans-serif',
        boxShadow: 'none',

        // needed to change the look of buttons to something reasonable.
        backgroundColor: 'inherit',
        border: 'none',
        outlineColor: 'transparent',
        borderRadius: '4px'

    };

    public static NODE_SELECTOR: React.CSSProperties = {
        lineHeight: '1.5',
        fontSize: '15px',
        userSelect: 'none',
        marginTop: 'auto',
        marginBottom: 'auto',
        paddingLeft: '5px',

    };

    public static NODE_BODY: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
        // paddingLeft: '5px',
        flexGrow: 1,
    };

    public static NODE_RIGHT: React.CSSProperties = {

        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',

        fontSize: '15px',
        lineHeight: '1.5',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        marginRight: '5px',
        fontFamily: 'sans-serif',
        boxShadow: 'none',
        color: 'var(--grey300)',

        display: 'flex',

    };

    public static CREATE_BUTTON: React.CSSProperties = {

        marginTop: 'auto',
        marginBottom: 'auto',

        // needed to change the look of buttons to something reasonable.
        backgroundColor: 'inherit',
        border: 'none',
        outlineColor: 'transparent',
        borderRadius: '4px'

    };

    public static CREATE_ICON: React.CSSProperties = {

        marginTop: 'auto',
        marginBottom: 'auto',

        fontSize: '12px',
        lineHeight: '1.5',
        userSelect: 'none',
        whiteSpace: 'nowrap',

        // needed to change the look of buttons to something reasonable.
        backgroundColor: 'inherit',
        border: 'none',
        outlineColor: 'transparent',
        borderRadius: '4px'

    };

}

// TODO

//   - what about long press?
//   - what about context menus?
//   - FIXME: implement the onSelect handler to callback which nodes are
//    actually selected and an object for each node.

//   - FIXME: I need to put the NUMBER of items in the tree to the right AND I need to
//     support a 'create folder' option too for creating a nested folder.
//
//   - FIXME: I need the abiltiy to filter the tree view so that we can filter
//            the tags easily.
//
//  - FIXME: hover needs to support clicking on the parent... to select the node.
//
//  - FIXME: need to support folder rename?
//
//  - FIXME: creating a NEW folder

export class TreeNode<V> extends React.Component<IProps<V>, IState<V>> {

    public readonly id: number;
    public readonly value: V;

    constructor(props: IProps<V>, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);
        this.deselect = this.deselect.bind(this);
        this.onCheckbox = this.onCheckbox.bind(this);
        this.onClick = this.onClick.bind(this);
        this.dispatchSelected = this.dispatchSelected.bind(this);

        this.id = this.props.node.id;
        this.value = this.props.node.value;

        this.state = {
        };

    }

    // public componentWillUnmount(): void {
    //     this.deselect();
    // }

    public render() {

        const {treeState} = this.props;
        const {node} = this.props;
        const children = node.children || [];

        // during expand/collapse new nodes are created and we have to keep the
        // index updated or we will access a component that no longer exists.
        // not sure why but this needs to be updated for each render and
        // components aren't always created.
        treeState.index[this.id] = this;

        const createIcon = () => {

            if (children.length > 0) {

                // if (this.state.node.closed) {
                //     return 'fas fa-caret-right';
                // } else {
                //     return 'fas fa-caret-down';
                // }

                // if (closed) {
                //     return 'fas fa-plus';
                // } else {
                //     return 'fas fa-minus';
                // }

                if (closed) {
                    return 'far fa-plus-square';
                } else {
                    return 'far fa-minus-square';
                }

                // <i className="far fa-plus-square"></i>
            }

            // return "far fa-file";
            return "";

        };

        const selected = isPresent(treeState.selected[this.id]);

        const closed = treeState.closed.contains(node.id);

        const nodeButtonClazz = selected ? 'bg-primary text-white' : '';

        const icon = createIcon();

        return (

            <div style={{}}>

                <div style={Styles.NODE_PARENT} className="hover-highlight">

                        <div style={Styles.NODE_ICON}
                             className={icon}
                             onClick={() => this.toggle()}>
                        </div>

                        <div style={Styles.NODE_SELECTOR}>
                            {/*<Input className="m-0" type="checkbox" />*/}
                            {/*X*/}
                            <input className="m-0"
                                   checked={selected}
                                   type="checkbox"
                                   onChange={event => this.onCheckbox(event)}/>

                        </div>

                        <div style={Styles.NODE_BODY}
                             onDoubleClick={() => this.toggle()}
                             onClick={(event: React.MouseEvent<HTMLElement>) => this.onClick(event)}>

                            <button style={Styles.NODE_NAME}
                                    className={"p-0 pl-1 pr-1 border-0 " + nodeButtonClazz}
                                    color="light">

                                {node.name}

                            </button>

                        </div>

                        <div style={Styles.NODE_RIGHT}>

                            {/*<div className="mt-auto mb-auto">*/}
                            {/*    <button style={Styles.CREATE_BUTTON}>*/}

                            {/*        <i style={Styles.CREATE_ICON}*/}
                            {/*           className="hover-button fas fa-plus"></i>*/}

                            {/*    </button>*/}
                            {/*</div>*/}

                            <div>
                                {node.count}
                            </div>

                        </div>

                    </div>

                <TreeNodeChildren children={children}
                                  closed={closed}
                                  treeState={this.props.treeState}/>

            </div>

        );

    }

    private onClick(event: React.MouseEvent<HTMLElement>) {
        const multi = event.ctrlKey;
        this.select(multi);
    }

    private onCheckbox(event: React.ChangeEvent<HTMLInputElement>) {
        this.select(true, event.target.checked);
    }

    private toggle() {

        const children = this.props.node.children || [];

        if (children.length === 0) {
            // doesn't make sense to expand/collapse something without children.
            return;
        }

        this.props.treeState.closed.toggle(this.props.node.id);

        this.setState({...this.state, idx: Date.now()});

    }

    private deselect() {
        delete this.props.treeState.selected[this.id];
        this.setState({...this.state, idx: Date.now()});
    }

    private select(multi: boolean = false,
                   selected: boolean = true) {

        const {treeState} = this.props;

        if (!multi) {

            for (const id of Object.values(treeState.selected)) {

                const node = treeState.index[id];
                Preconditions.assertPresent(node, "No node for id: " + id);

                node.deselect();
                delete treeState.selected[id];

            }

        }

        if (selected) {
            console.log("FIXME: selecting IT");
            treeState.selected[this.id] = this.id;
        } else {
            delete treeState.selected[this.id];
        }

        this.setState({...this.state, idx: Date.now()});

        this.dispatchSelected();

    }

    private dispatchSelected() {
        const {treeState} = this.props;

        const selected = Object.values(treeState.selected)
            .filter(nodeID => isPresent(nodeID))
            .map(nodeID => treeState.index[nodeID])
            .map(node => node.value);

        console.log("FIXME: dispatching selected ", selected);

        treeState.onSelected(selected);

    }

}

interface IProps<V> {
    readonly node: TNode<V>;
    readonly treeState: TreeState<V>;
}


interface IState<V> {
    readonly idx?: number;
}


