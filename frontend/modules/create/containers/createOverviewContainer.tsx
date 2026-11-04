import React, { Component } from 'react';
import axios from 'axios';
import CreateOverview from '../components/createOverview';
import WithCache from '~/core/cache/containers/withCache';
import { Stem } from '~/modules/stems/stems.types';
import { Slide } from '~/modules/slides/slides.types';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import find from 'lodash/find';
import getTree from '../helpers/getTree';
import setCanBeBranchedTo from '../helpers/setCanBeBranchedTo';
import getStemsByRef from '../helpers/getStemsByRef';
import getOffsetsX from '../helpers/getOffsetsX';
import parseTree from '../helpers/parseTree';
import setStemLabels from '../helpers/setStemLabels';
import getEdges from '../helpers/getEdges';
import getActiveStemRef from '~/modules/stems/helpers/getActiveStemRef';
import { PositionedStem } from '../create.types';
import WithRouter from '~/core/app/components/withRouter';
import getScenarioDetails from '~/modules/run/helpers/getScenarioDetails';
import handleRequestError from '~/core/app/helpers/handleRequestError';

type Props = {
  editor: {
    set: (data: { stemPath?: string[], branchToStem?: string | null }) => void;
    data: any;
  };
  scenario: { data: Scenario };
  stems: { data: Stem[], fetch: () => Promise<any> };
  slides: { data: Slide[] };
};

class CreateOverviewContainer extends Component<Props> {

  onStemClicked = ({ stemRef }: { stemRef: string }) => {
    this.props.editor.set({ stemPath: [stemRef] });
  }

  onBranchToStemClicked = ({ stemRef }: { stemRef: string | null }) => {
    this.props.editor.set({ branchToStem: stemRef });
  }

  onLinkToStemClicked = ({ stemRef }: { stemRef: string }) => {
    const { branchToStem } = this.props.editor.data;
    const branchFromStem = find(this.props.stems.data, { ref: branchToStem });

    this.props.editor.set({ branchToStem: null });

    if (!branchFromStem || find(branchFromStem.branchingOptions, { stemRef })) return;

    axios.put(`/api/stems/${branchFromStem._id}`, {
      branchingOptions: [...branchFromStem.branchingOptions, { stemRef, conditions: [] }]
    }).then(() => {
      this.props.stems.fetch();
    }).catch(handleRequestError);
  }

  render() {
    const { activeSlideId } = getScenarioDetails();

    const builtTree = getTree({
      stems: this.props.stems.data,
      slides: this.props.slides.data,
      scenarioId: this.props.scenario.data._id,
      activeSlideId,
      activeStemRef: getActiveStemRef()
    });

    if (!builtTree) return null;

    const { columnsByRef } = builtTree;

    console.log("columnsByRef", columnsByRef)

    setCanBeBranchedTo({
      tree: builtTree.tree,
      stems: this.props.stems.data,
      branchToStem: this.props.editor.data.branchToStem,
      columnsByRef
    });

    const stemsByRef = getStemsByRef({ tree: builtTree.tree as PositionedStem });
    const { tree, maxWidth, maxHeight } = parseTree({
      tree: builtTree.tree as PositionedStem,
      offsetsX: getOffsetsX({ stemsByRef })
    });
    setStemLabels({ stemsByRef, columnsByRef });
    const edges = getEdges({ stemsByRef });

    return (
      <CreateOverview
        tree={tree}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        edges={edges}
        branchToStem={this.props.editor.data.branchToStem}
        onStemClicked={this.onStemClicked}
        onBranchToStemClicked={this.onBranchToStemClicked}
        onLinkToStemClicked={this.onLinkToStemClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CreateOverviewContainer, {}, ['editor', 'scenario', 'stems', 'slides']));
