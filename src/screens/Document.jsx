import React, { Component } from 'react';
import createStyles from 'draft-js-custom-styles';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

import {
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js'

/* Define custom styles */
const customStyleMap = {
  remoteCursor: {
    borderLeft: 'solid 3px red'
  }
}

/* Have draft-js-custom-styles build help functions for toggling font-size, color */
const {
  styles,
  customStyleFn,
} = createStyles(['font-size', 'color'], customStyleMap)

/* Let draft-js know what styles should be block vs inline
 * NOTE: This is needed, but RichUtils.toggleBlockType,
 *       RichUtils.toggleInlineStyle need to get called
 */
function isBlockStyle(style) {
  if(style.indexOf('text-align-') === 0) return true
  return false
}

function getBlockStyle(block) {
  const type = block.getType()
  return isBlockStyle(type) ? type : null
}

/* list of button we need to render */
const FORMAT_BAR = [
  {style:'BOLD', label:'B'},
  {style:'ITALIC', label:'I'},
  {style:'UNDERLINE', label:'U'},
  {style:'text-align-left', label:'left'},
  {style:'text-align-center', label:'center'},
  {style:'text-align-right', label:'right'},
]

export default class Document extends Component {
  state = {
    // We need to create am empty editor state
    // because draftJS state is complex!
    editorState: EditorState.createEmpty()
  }

  // track any changes that draftJS makes in react state
  onChange = (editorState) => this.setState({editorState})

  // helper function to toggle draftJS style changes
  onToggleStyle = (style) => (e) => {
    const toggleFn = isBlockStyle(style) ? RichUtils.toggleBlockType : RichUtils.toggleInlineStyle
    this.onChange(toggleFn(this.state.editorState, style))

    e.preventDefault()
  }

  // helper function to set draftJS complex types that need a value like (color, font-size)
  onSetStyle = (name, val) => (e) => {
    this.onChange(styles[name].toggle(this.state.editorState, val))

    e.preventDefault()
  }

  mark = (e) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'remoteCursor'))
    e.preventDefault()
  }

  render() {
    return (<div>
      <AppBar
        title={this.props.docTitle? this.docTitle: 'Doc Title'}
        iconElementRight={<IconButton>
            <FontIcon className="material-icons">home</FontIcon>
        </IconButton>}
      />

      {FORMAT_BAR.map(({style, label}) => <button onClick={this.onToggleStyle(style)}>{label}</button>)}
      {[8,12,24].map(size => <button onClick={this.onSetStyle('fontSize', size)}>{size}px</button>)}
      {['red','blue'].map(color => <button onClick={this.onSetStyle('color', color)}>{color}</button>)}

      <button onClick={this.mark}>mark</button>

      <div className="draft-editor-container">
        <Editor
          editorState={this.state.editorState}
          customStyleMap={customStyleMap}
          customStyleFn={customStyleFn}
          blockStyleFn={getBlockStyle}
          onChange={this.onChange}
        />
      </div>
    </div>);
  }
}
