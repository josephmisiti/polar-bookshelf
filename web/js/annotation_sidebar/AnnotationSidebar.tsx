import * as React from 'react';
import {Logger} from '../logger/Logger';
import {Comment} from '../metadata/Comment';
import {DocMeta} from '../metadata/DocMeta';
import {DocAnnotations} from './DocAnnotations';
import {DocAnnotation} from './DocAnnotation';
import {DocAnnotationIndex} from './DocAnnotationIndex';
import {DocAnnotationIndexes} from './DocAnnotationIndexes';
import {AreaHighlightModel} from '../highlights/area/model/AreaHighlightModel';
import {MutationType} from '../proxies/MutationType';
import {TextHighlightModel} from '../highlights/text/model/TextHighlightModel';
import {isPresent} from '../Preconditions';
import {DocAnnotationComponent} from './annotations/DocAnnotationComponent';
import {CommentModel} from './CommentModel';
import {Ref, Refs} from '../metadata/Refs';
import {FlashcardModel} from './FlashcardModel';
import {Flashcard} from '../metadata/Flashcard';
import {ExportButton} from '../ui/export/ExportButton';
import {ExportFormat, Exporters} from '../metadata/exporter/Exporters';
import {SplitBar, SplitBarLeft, SplitBarRight} from '../../../apps/repository/js/SplitBar';

const log = Logger.create();

export class AnnotationSidebar extends React.Component<AnnotationSidebarProps, AnnotationSidebarState> {

    private docAnnotationIndex: DocAnnotationIndex = new DocAnnotationIndex();

    constructor(props: AnnotationSidebarProps, context: any) {
        super(props, context);

        this.scrollToAnnotation = this.scrollToAnnotation.bind(this);
        this.onExport = this.onExport.bind(this);

        const annotations = DocAnnotations.getAnnotationsForPage(props.docMeta);

        this.docAnnotationIndex
            = DocAnnotationIndexes.rebuild(this.docAnnotationIndex, ...annotations);

        this.state = {
            annotations: this.docAnnotationIndex.sortedDocAnnotation
        };

    }

    public componentDidMount(): void {

        // TODO: remove all these listeners when the component unmounts...

        new AreaHighlightModel().registerListener(this.props.docMeta, annotationEvent => {

            const docAnnotation =
                this.convertAnnotation(annotationEvent.value,
                                       annotationValue => DocAnnotations.createFromAreaHighlight(annotationValue,
                                                                                                 annotationEvent.pageMeta));

            this.handleAnnotationEvent(annotationEvent.id,
                                       annotationEvent.traceEvent.mutationType,
                                       docAnnotation);

        });

        new TextHighlightModel().registerListener(this.props.docMeta, annotationEvent => {

            const docAnnotation =
                this.convertAnnotation(annotationEvent.value,
                                       annotationValue => DocAnnotations.createFromTextHighlight(annotationValue,
                                                                                                 annotationEvent.pageMeta));

            this.handleAnnotationEvent(annotationEvent.id,
                                       annotationEvent.traceEvent.mutationType,
                                       docAnnotation);
        });

        new CommentModel().registerListener(this.props.docMeta, annotationEvent => {

            const comment: Comment = annotationEvent.value || annotationEvent.previousValue;
            const childDocAnnotation = DocAnnotations.createFromComment(comment, annotationEvent.pageMeta);

            this.handleChildAnnotationEvent(annotationEvent.id,
                                            annotationEvent.traceEvent.mutationType,
                                            childDocAnnotation);

        });

        new FlashcardModel().registerListener(this.props.docMeta, annotationEvent => {

            const flashcard: Flashcard = annotationEvent.value || annotationEvent.previousValue;
            const childDocAnnotation = DocAnnotations.createFromFlashcard(flashcard, annotationEvent.pageMeta);

            this.handleChildAnnotationEvent(annotationEvent.id,
                                            annotationEvent.traceEvent.mutationType,
                                            childDocAnnotation);

        });

    }

    private convertAnnotation<T>(value: any | undefined | null, converter: (input: any) => T) {

        if (! isPresent(value)) {
            return undefined;
        }

        return converter(value);

    }

    private handleChildAnnotationEvent(id: string,
                                       mutationType: MutationType,
                                       childDocAnnotation: DocAnnotation) {

        if (! childDocAnnotation.ref) {
            // this is an old annotation.  We can't show it in the sidebar yet.
            log.warn("Annotation hidden from sidebar: ", childDocAnnotation);
            return;
        }

        const ref = Refs.parse(childDocAnnotation.ref!);

        const annotation = this.docAnnotationIndex.docAnnotationMap[ref.value];

        if (! annotation) {
            log.warn("No annotation for ref:", annotation);
            return;
        }

        if (! annotation.children) {
            annotation.children = [];
        }

        if (mutationType !== MutationType.DELETE) {

            annotation.children.push(childDocAnnotation);
            annotation.children.sort((c0, c1) => -c0.created.localeCompare(c1.created));

        } else {

            annotation.children =
                annotation.children.filter(current => current.id !== id);

        }

        this.reload();


    }

    private handleAnnotationEvent(id: string,
                                  mutationType: MutationType,
                                  docAnnotation: DocAnnotation | undefined) {

        if (mutationType === MutationType.INITIAL) {
            // we already have the data properly.
            return;
        } else if (mutationType === MutationType.DELETE) {

            this.docAnnotationIndex
                = DocAnnotationIndexes.delete(this.docAnnotationIndex, id);

            this.reload();

        } else {
            this.refresh(docAnnotation!);
        }

    }

    private refresh(docAnnotation: DocAnnotation) {

        this.docAnnotationIndex
            = DocAnnotationIndexes.rebuild(this.docAnnotationIndex, docAnnotation);

        this.reload();

    }

    private reload() {

        this.setState({
            annotations: this.docAnnotationIndex.sortedDocAnnotation
        });

    }

    private scrollToAnnotation(id: string, pageNum: number) {

        const selector = `.page div[data-annotation-id='${id}']`;

        const pageElements: HTMLElement[] = Array.from(document.querySelectorAll(".page"));
        const pageElement = pageElements[pageNum - 1];

        if (!pageElement) {
            log.error(`Could not find page ${pageNum} of N pages: ${pageElements.length}`);
            return;
        }

        this.scrollToElement(pageElement);

        const annotationElement = document.querySelector(selector)! as HTMLElement;

        this.scrollToElement(annotationElement);

    }

    private scrollToElement(element: HTMLElement) {

        element.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });

    }

    private createItems(annotations: DocAnnotation[]) {

        // https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778

        // TODO: I'm not sure what type of class a <div> or React element uses
        // so using 'any' for now.

        const result: any = [];

        annotations.map(annotation => {
            result.push (<DocAnnotationComponent key={annotation.id} annotation={annotation}/>);
        });

        return result;

    }

    private onExport(path: string, format: ExportFormat) {

        Exporters.doExport(path, format, this.props.docMeta)
            .catch(err => log.error(err));

    }

    public render() {

        const { annotations } = this.state;

        const AnnotationHeader = () => {

            if (annotations.length === 0) {
                return (<div></div>);
            }

            return (


                <div className="p-1 pb-2 mb-3 border-bottom pl-1 pr-1">

                    <SplitBar>

                        <SplitBarLeft>
                            <div style={{fontWeight: 'bold', fontSize: '14px'}}>Annotations</div>
                        </SplitBarLeft>

                        <SplitBarRight>

                            <ExportButton onExport={(path, format) => this.onExport(path, format)}/>

                        </SplitBarRight>


                    </SplitBar>

                </div>

            );

        };

        return (

            <div id="annotation-manager" className="annotation-sidebar">

                <AnnotationHeader/>

                <div className="annotations">
                    {this.createItems(annotations)}
                </div>

            </div>

        );
    }

}

export interface AnnotationSidebarState {

    annotations: DocAnnotation[];
}


export interface AnnotationSidebarProps {
    readonly docMeta: DocMeta;
}

