import * as React from 'react';
import {ListOptionType, ListSelector} from '../../js/ui/list_selector/ListSelector';
import {DocRepoTableDropdown} from '../../../apps/repository/js/doc_repo/DocRepoTableDropdown';
import {AnnotationSidebar} from '../../js/annotation_sidebar/AnnotationSidebar';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {Proxies} from '../../js/proxies/Proxies';
import {Rect} from '../../js/Rect';
import {TextRect} from '../../js/metadata/TextRect';
import {TextHighlightRecords} from '../../js/metadata/TextHighlightRecords';
import {CommentComponentExample} from './CommentComponentExample';
import {FlashcardComponentExample} from './FlashcardComponentExample';
import {WhatsNewContent} from '../../../apps/repository/js/splash/splashes/whats_new/WhatsNewContent';
import {CloudSyncOverviewContent} from '../../js/ui/cloud_auth/CloudSyncOverviewContent';
import {CloudSyncConfiguredContent} from '../../js/ui/cloud_auth/CloudSyncConfiguredContent';
import {HighlighterIcon} from '../../js/ui/standard_icons/HighlighterIcon';
import {ToggleButton} from '../../js/ui/ToggleButton';
import {TagInput} from '../../../apps/repository/js/TagInput';
import {Tag} from '../../../web/js/tags/Tag';
import {RelatedTags} from '../../js/tags/related/RelatedTags';
import {CommentIcon} from '../../js/ui/standard_icons/CommentIcon';
import {FlashcardIcon} from '../../js/ui/standard_icons/FlashcardIcon';
import {AnnotationFlashcardBox} from '../../js/annotation_sidebar/flashcard_input/AnnotationFlashcardBox';
import {FlashcardInputForCloze} from '../../js/annotation_sidebar/flashcard_input/FlashcardInputForCloze';
import {FlashcardInputForFrontAndBack} from '../../js/annotation_sidebar/flashcard_input/FlashcardInputForFrontAndBack';
import {AnnotationCommentBox} from '../../js/annotation_sidebar/AnnotationCommentBox';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {ExportButton} from '../../js/ui/export/ExportButton';
import {EditorsPicksContent} from '../../../apps/repository/js/editors_picks/EditorsPicksContent';
import {AnkiReviewContent} from './AnkiReviewContent';
import ReadingProgressTable from '../../../apps/repository/js/stats/ReadingProgressTable';
import {ContextMenuWrapper, prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {TestMenu} from './TestMenu';
import {Feedback} from '../../js/ui/feedback/Feedback';
import Button from 'reactstrap/lib/Button';
import {Toaster} from '../../js/ui/toaster/Toaster';
import {ipcRenderer} from 'electron';
import {AlternativeToReview} from '../../../apps/repository/js/splash/splashes/alternativeto_review/AlternativeToReview';
import {ChromeExtensionReview} from '../../../apps/repository/js/splash/splashes/chrome_extension_review/ChromeExtensionReview';
import {Survey} from '../../../apps/repository/js/splash/splashes/survey/Survey';
import {ProgressToaster} from '../../js/ui/progress_toaster/ProgressToaster';
import {ProgressToasters} from '../../js/ui/progress_toaster/ProgressToasters';
import {PreviewDisclaimer} from '../../../web/js/apps/repository/PreviewDisclaimer';
import {AccountControlBar} from '../../../web/js/ui/cloud_auth/AccountControlBar';
import {NULL_FUNCTION} from '../../js/util/Functions';
import {AccountControlDropdown} from '../../../web/js/ui/cloud_auth/AccountControlDropdown';

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.state = {
            dropdownOpen: false,
            splitButtonOpen: false
        };
    }

    public render() {

        // ProgressBar.create();

        const options: ListOptionType[] = [
            {
                id: "title",
                label: "Title",
                selected: true
            },
            {
                id: "tags",
                label: "Tags",
                selected: false
            }
        ];

        const docMeta = Proxies.create(MockDocMetas.createWithinInitialPagemarks('0x001', 4));

        const rects: Rect[] = [ new Rect({top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100}) ];
        const textSelections: TextRect[] = [new TextRect({text: "hello world"})];
        const text = "hello world";

        const textHighlight = TextHighlightRecords.create(rects, textSelections, {TEXT: text});

        // const ref = Refs.createFromAnnotationType(textHighlight.id,
        // AnnotationType.TEXT_HIGHLIGHT);

        docMeta.pageMetas[1].textHighlights[textHighlight.id] = textHighlight.value;

        // let flashcard = Flashcards.createFrontBack(front, back, ref);
        //
        // // TODO: an idiosyncracie of the proxies system is that it mutates
        // the // object so if it's read only it won't work.  This is a bug
        // with // Proxies so I need to also fix that bug there in the future.
        // flashcard = Object.assign({}, flashcard);
        // annotation.pageMeta.flashcards[flashcard.id] = flashcard;


        // TODO: we have to create some flashcards and comments for this object
        // so that the annotation sidear renders.

        const relatedTags = new RelatedTags();

        relatedTags.update('0x01', 'set', 'linux');
        relatedTags.update('0x01', 'set', 'microsoft');

        relatedTags.update('0x02', 'set', 'linux');
        relatedTags.update('0x02', 'set', 'google');

        relatedTags.update('0x03', 'set', 'linux');
        relatedTags.update('0x03', 'set', 'microsoft');

        relatedTags.update('0x04', 'set', 'linux');
        relatedTags.update('0x04', 'set', 'microsoft');

        relatedTags.update('0x05', 'set', 'linux');
        relatedTags.update('0x05', 'set', 'google');

        const tags: Tag[] = [
            {id: 'microsoft', label: 'microsoft'},
            {id: 'google', label: 'google'}
        ];

        const existingTags: Tag[] = [
            {id: 'google', label: 'google'}
        ];

        const contextMenuHandlers = prepareContextMenuHandlers({id: 'my-context-menu'});

        const steps = [
            {
                target: '.my-first-step',
                content: 'This is my awesome feature!',
                disableBeacon: true
            },
            {
                target: '.my-other-step',
                content: 'This another awesome feature!',
            },
        ];
        // Toaster.success('A new update for Polar was downloaded.  Please
        // restart.', 'Update downloaded', { requiresAcknowledgment: true,
        // preventDuplicates: true });  Toaster.info('X A new update for Polar
        // was downloaded.  Please restart.', 'Update downloaded', {
        // requiresAcknowledgment: true, preventDuplicates: true });

        ProgressToasters.create()
            .then(progressUpdater => {
                progressUpdater.update({title: "Finding files (5) ... ", status: '/home/burton/projects/polar-bookshelf/web/js/apps/repository/FileImportController.ts'});
            });

        return (

            <div>

                <div style={{width: '400px'}} className="border border-danger">

                    <AccountControlBar
                        userInfo={{
                            displayName: 'Kevin Burton',
                            email: 'burton@inputneuron.io',
                            photoURL: "https://yt3.ggpht.com/-b4nK9nmcX9s/AAAAAAAAAAI/AAAAAAAAAAA/LKdHcpzMesw/s88-c-k-no-mo-rj-c0xffffff/photo.jpg",
                            emailVerified: true,
                            uid: '10101'
                        }}
                        onLogout={NULL_FUNCTION}
                        onInvite={NULL_FUNCTION}/>

                </div>


                <AccountControlDropdown
                    userInfo={{
                        displayName: 'Kevin Burton',
                        email: 'burton@inputneuron.io',
                        photoURL: "https://yt3.ggpht.com/-b4nK9nmcX9s/AAAAAAAAAAI/AAAAAAAAAAA/LKdHcpzMesw/s88-c-k-no-mo-rj-c0xffffff/photo.jpg",
                        emailVerified: true,
                        uid: '10101'
                    }}
                    onLogout={NULL_FUNCTION}
                    onInvite={NULL_FUNCTION}/>

                <div>

                    <Button className="rounded-circle border border-primary"
                            style={{
                                borderWidth: '2px !important',
                                padding: '2px'
                            }}
                            size="sm"
                            color="light">

                        <img className="rounded-circle"
                             style={{maxHeight: '50px'}}
                             src="https://yt3.ggpht.com/-b4nK9nmcX9s/AAAAAAAAAAI/AAAAAAAAAAA/LKdHcpzMesw/s88-c-k-no-mo-rj-c0xffffff/photo.jpg"/>

                    </Button>

                </div>

                <br/>

                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                {/*<PreviewDisclaimer/>*/}

                <div style={{
                    height: '300px',
                    backgroundColor: 'red'
                }}>


                    <div className="fas fa-link" style={{fontSize: '17px', marginTop: 'auto', marginBottom: 'auto', display: 'inline-block'}}></div>

                </div>

                {/*<ChromeExtensionReview settingKey={'asdf'}/>*/}

                {/*<Survey settingKey={'asdf'}/>*/}

                {/*<div style={{*/}
                        {/*width: '500px',*/}
                        {/*position: 'fixed',*/}
                        {/*right: 10,*/}
                        {/*bottom: 10,*/}
                        {/*zIndex: 9999,*/}
                    {/*}}*/}
                    {/*className="border rounded shadow p-3 m-2 text-white bg-dark">*/}

                    {/*<div style={{*/}
                            {/*display: 'flex',*/}
                            {/*verticalAlign: 'middle'*/}
                        {/*}}*/}
                        {/*className="mb-3">*/}

                        {/*<div className="mr-3 text-success mt-auto mb-auto">*/}

                            {/*<i style={{fontSize: '50px'}} className="fas fa-check"></i>*/}

                        {/*</div>*/}

                        {/*<div className="mt-1 mb-1">*/}

                            {/*<div className="mb-1" style={{fontSize: '18px'}}>*/}
                                {/*<b>Update available.</b> Please restart.*/}
                            {/*</div>*/}

                            {/*<div className="mt-1 mb-1 h6">*/}
                                {/*An update was downloaded and ready to be*/}
                                {/*installed. Please restart to install the latest*/}
                                {/*version.*/}
                            {/*</div>*/}

                        {/*</div>*/}

                    {/*</div>*/}

                    {/*<div>*/}

                        {/*<div className="text-center text-white">*/}
                            {/*<Button onClick={() => ipcRenderer.send('app-update:quit-and-install')}*/}
                                    {/*style={{*/}
                                        {/*fontWeight: 'bold'*/}
                                    {/*}}*/}
                                    {/*size="lg"*/}
                                    {/*color="success">*/}
                                {/*Restart*/}
                            {/*</Button>*/}
                        {/*</div>*/}

                    {/*</div>*/}


                {/*</div>*/}

                {/*<AlternativeToReview settingKey={'asdf'}/>*/}

                {/*<Premium settingKey='premium-key'/>*/}

                <h1 className="component">Feedback without description</h1>

                <div className="text-center">
                    <Feedback category="tour-feedback"
                              title="How likely are you to continue using Polar?"
                              noEvent={true}
                              from="Not likely"
                              to="Very likely"/>
                </div>

                <h1 className="component">Feedback without description</h1>

                <div className="text-center">
                    <Feedback category="tour-feedback"
                              title="How likely are you to continue using Polar?"
                              description="We wanted to get your initial thoughts after taking the tour."
                              noEvent={true}
                              unsure={true}
                              from="Not likely"
                              to="Very likely"/>
                </div>


                <div className="bg-dark text-white">
                    <div className="p-1 hover-bg-primary">Menu item 1</div>
                    <div className="p-1 hover-bg-primary">Menu item 2</div>
                </div>

                <div className="my-first-step">
                    my first step

                </div>
                <div className="my-other-step">
                    my other step
                </div>

                {/*<Joyride*/}
                    {/*steps={steps}*/}
                    {/*continuous={true}*/}
                    {/*run={true}*/}
                    {/*showProgress={true}*/}
                    {/*showSkipButton={true}*/}
                    {/*styles={{*/}
                        {/*options: {*/}
                            {/*// arrowColor: '#e3ffeb',*/}
                            {/*// backgroundColor: '#e3ffeb',*/}
                            {/*// overlayColor: 'rgba(79, 26, 0, 0.4)',*/}
                            {/*primaryColor: '#007bff',*/}
                            {/*// textColor: '#004a14',*/}
                            {/*// width: 900,*/}
                            {/*// zIndex: 1000,*/}
                        {/*}*/}
                    {/*}}*/}
                    {/*/>*/}

                {/*<DropMenu open={true}>*/}

                    {/*<DropdownMenu tag="div">*/}

                        {/*<DropdownItem tag="div">Quo Action</DropdownItem>*/}

                        {/*<DropdownItem tag="div">*/}

                            {/*<DropMenu open={false}>*/}

                                {/*<DropdownMenu tag="div">*/}

                                    {/*<DropdownItem tag="div">Quo Action</DropdownItem>*/}

                                {/*</DropdownMenu>*/}

                            {/*</DropMenu>*/}

                        {/*</DropdownItem>*/}

                    {/*</DropdownMenu>*/}

                {/*</DropMenu>*/}

                {/*<UncontrolledDropdown direction="right">*/}
                    {/*<DropdownToggle color="light" caret>*/}
                        {/*Dropdown*/}
                    {/*</DropdownToggle>*/}
                    {/*<DropdownMenu>*/}
                        {/*<DropdownItem header>Header</DropdownItem>*/}
                        {/*<DropdownItem disabled>Action</DropdownItem>*/}
                        {/*<DropdownItem>Another Action</DropdownItem>*/}
                        {/*<DropdownItem divider />*/}
                        {/*<DropdownItem>Another Action</DropdownItem>*/}

                        {/*<DropdownItem>*/}

                            {/*<UncontrolledDropdown direction="right">*/}
                                {/*<DropdownToggle color="light" caret>*/}
                                    {/*Dropdown*/}
                                {/*</DropdownToggle>*/}
                                {/*<DropdownMenu>*/}
                                    {/*<DropdownItem header>Header</DropdownItem>*/}
                                    {/*<DropdownItem disabled>Action</DropdownItem>*/}
                                    {/*<DropdownItem>Another Action</DropdownItem>*/}
                                    {/*<DropdownItem divider />*/}
                                    {/*<DropdownItem>Another Action</DropdownItem>*/}

                                    {/*<DropdownItem>*/}


                                    {/*</DropdownItem>*/}

                                {/*</DropdownMenu>*/}
                            {/*</UncontrolledDropdown>*/}

                        {/*</DropdownItem>*/}

                    {/*</DropdownMenu>*/}
                {/*</UncontrolledDropdown>*/}

                <div {...contextMenuHandlers} >

                    this is some content

                    <ContextMenuWrapper id="my-context-menu">

                        {/*<div className="border" style={{backgroundColor: 'white', width: '250px'}}>*/}
                            {/*thisis the div for the context menu*/}

                        {/*</div>*/}
                        <TestMenu/>

                    </ContextMenuWrapper>

                </div>

                <br/>
                <br/><br/><br/>


                <ReadingProgressTable/>

                <AnkiReviewContent/>


                <br/>
                <br/><br/><br/>

                <EditorsPicksContent/>

                <ExportButton/>

                {/*<GDPRNotice/>*/}


                <UncontrolledDropdown direction="down"
                                      size="sm">

                    <DropdownToggle color="success" caret>
                        <i className="fas fa-plus" style={{marginRight: '5px'}}></i>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem size="sm" onClick={() => console.log('')}>
                            <i className="fas fa-hdd"></i> from disk
                        </DropdownItem>
                        <DropdownItem size="sm" onClick={() => console.log('')}>
                            <i className="fas fa-browser"></i>
                            from the web
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>



                {/*<h1 className="component">Top PDFs</h1>*/}


                {/*<TopPDFExample/>*/}

                <h1 className="component">Annotation Sidebar</h1>

                <AnnotationSidebar docMeta={docMeta}/>

                <h1 className="component">AnnotationCommentBox</h1>

                <AnnotationCommentBox id={'test-comment-box'}/>

                <h1 className="component">FlashcardInputForCloze</h1>

                <FlashcardInputForCloze
                    id={'FlashcardInputForCloze'}
                    onCancel={() => console.log("onCancel")}
                    onFlashcardCreated={(flashcardType, fields) => console.log("created: ", flashcardType, fields)}
                    onFlashcardChangeType={flashcardType => console.log("flashcardType: ", flashcardType)}/>

                <h1 className="component">FlashcardInputForFrontAndBack</h1>
                <FlashcardInputForFrontAndBack
                    id={'FlashcardInputForFrontAndBack'}
                    onCancel={() => console.log("onCancel")}
                    onFlashcardCreated={(flashcardType, fields) => console.log("created: ", flashcardType, fields)}
                    onFlashcardChangeType={flashcardType => console.log("flashcardType: ", flashcardType)}/>

                <h1 className="component">AnnotationFlashcardBox</h1>

                <AnnotationFlashcardBox id='flashcard-0'
                                        onCancel={() => console.log("onCancel")}
                                        onFlashcardCreated={(flashcardType, fields) => console.log("created: ", flashcardType, fields)}/>

                <h1 className="component">TagInput</h1>

                <TagInput availableTags={tags}
                          existingTags={existingTags}
                          relatedTags={relatedTags}
                          onChange={newTags => console.log('got tags', newTags)}/>

                <h1 className="component">Toggle Buttons</h1>

                <div className="p-2">
                    <ToggleButton label="flagged only" onChange={() => console.log('changed')}/>
                </div>

                <div className="p-2">
                    <ToggleButton label="toggle enabled" initialValue={true} onChange={() => console.log('changed')}/>
                </div>

                <h1 className="component">Standard Icons</h1>

                <p>
                    <b>highlighter: </b> <HighlighterIcon color={'yellow'}/>
                </p>

                <p>
                    <b>comment: </b> <CommentIcon/>
                </p>

                <p>
                    <b>flashcard: </b> <FlashcardIcon/>
                </p>


                {/*<InviteUsersContent onInvitedUserText={NULL_FUNCTION}/>*/}

                {/*<InviteUsersModal isOpen={true} onCancel={NULL_FUNCTION} onInvite={(emailAddresses) => console.log(emailAddresses)}/>*/}

                {/*<TableDropdown id={'table-dropdown'}></TableDropdown>*/}

                <h1 className="component">Typographic headings</h1>

                <h1>h1</h1>
                <h2>h2</h2>
                <h3>h3</h3>
                <h4>h4</h4>
                <h5>h5</h5>

                <h1 className="component">Intro classes</h1>

                <div className="intro">

                    <h1 className="title">This is the title</h1>

                    <h2 className="subtitle">This is the subtitle</h2>

                    <p>
                        This is just regular text.
                    </p>

                </div>

                <p>
                    List of important UI components in Polar.
                </p>

                <h1 className="component">ListSelector</h1>

                <ListSelector options={options}
                              id="list-options"
                              onChange={(value) => console.log(value)}>

                </ListSelector>

                <h1 className="component">TableDropdown</h1>

                <DocRepoTableDropdown id="table-dropdown"
                                      onSelectedColumns={(newOptions) => console.log("onSelectedColumns: ", newOptions)}
                />

                <h1 className="component">Annotation Sidebar</h1>

                <AnnotationSidebar docMeta={docMeta}/>

                <h1 className="component">Comment component</h1>

                <CommentComponentExample/>

                <h1 className="component">Flashcard component</h1>

                <FlashcardComponentExample/>

                <WhatsNewContent/>

                <CloudSyncOverviewContent/>

                <CloudSyncConfiguredContent/>

                {/*<CloudSyncConfiguredModal isOpen={true} onCancel={() => console.log('cancel')}/>*/}


                {/*<CloudSyncOverviewModal isOpen={true}*/}
                                        {/*onCancel={() => console.log('cancel')}*/}
                                        {/*onSignup={() => console.log('signup')}/>*/}

            </div>

        );
    }


    private toggleDropDown() {

        this.setState({
            splitButtonOpen: this.state.splitButtonOpen,
            dropdownOpen: !this.state.dropdownOpen
        });

    }

    private toggleSplit() {

        this.setState({
            splitButtonOpen: !this.state.splitButtonOpen
        });

    }



}

export default App;

interface IAppState {
    dropdownOpen: boolean;
    splitButtonOpen: boolean;

}


