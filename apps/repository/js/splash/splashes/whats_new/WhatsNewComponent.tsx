import * as React from 'react';
import {Version} from '../../../../../../web/js/util/Version';
import {Logger} from '../../../../../../web/js/logger/Logger';
import {WhatsNewModal} from './WhatsNewModal';
import {ConditionalSetting} from '../../../../../../web/js/ui/util/ConditionalSetting';
import {RendererAnalytics} from '../../../../../../web/js/ga/RendererAnalytics';
import * as semver from 'semver';
import {LifecycleToggle} from '../../../../../../web/js/ui/util/LifecycleToggle';
import {LifecycleEvents} from '../../../../../../web/js/ui/util/LifecycleEvents';

const log = Logger.create();

/**
 * @Deprecated no longer used with the new splashes system.
 */
export class WhatsNewComponent extends React.Component<IProps, IState> {

    private readonly conditionalSetting = new ConditionalSetting('polar-whats-new-version');

    constructor(props: IProps, context: any) {
        super(props, context);

        this.hide = this.hide.bind(this);

        this.handleVersionState = this.handleVersionState.bind(this);
        this.isNewVersion = this.isNewVersion.bind(this);

        this.state = {
            open: false
        };

    }

    public componentDidMount(): void {

        this.handleVersionState()
            .catch( err => log.error("Unable to read version: ", err));

    }

    public render() {

        // noinspection TsLint
        return (
            <WhatsNewModal accept={() => this.hide()}/>
        );
    }

    private hide(): void {
        this.setState({open: false});
    }

    private async handleVersionState() {

        const hasTourTerminated =
            LifecycleToggle.isMarked(LifecycleEvents.TOUR_TERMINATED);

        const isNewVersion = await this.isNewVersion();

        if (isNewVersion) {
            RendererAnalytics.event({category: 'app', action: 'whats-new-displayed'});
        }

        const open = isNewVersion && hasTourTerminated;

        this.setState({
            open
        });

    }

    private async isNewVersion(): Promise<boolean> {

        const currentVersion = Version.get();

        const result =
            this.conditionalSetting.accept(value => semver.gt(currentVersion, value.getOrElse('')) );

        this.conditionalSetting.set(currentVersion);

        return result;

    }

}

interface IProps {
}

interface IState {
    open: boolean;
}

interface VersionData {
    version?: string;
}

