'use strict';

import Component from 'metal-component';
import malarkey from 'malarkey';
import Soy from 'metal-soy';
import templates from './TerminalComponent.soy.js';

/**
 * This component simulates a terminal running the wedeploy cli.
 */
class TerminalComponent extends Component {
  attached() {
    this.console();
  }

  console() {
    /* Key codes
    /* ====================================================================== */

    const RETURN_KEY_CODE = 13;
    const K_KEY_CODE = 75;

    /* Initialize the console
    /* ====================================================================== */

    const preEl = document.querySelector('.start-demo-content pre');

    const consoleEl = preEl.parentElement.parentElement;

    /* Activate content-editable areas on click
    /* ====================================================================== */

    consoleEl.addEventListener('click', (event) => {
      // contenteditable element within the console
      const contentEditableEl = preEl.querySelector('[contenteditable]');

      // if the contenteditable element exists and is not already being clicked into
      if (contentEditableEl && !contentEditableEl.contains(event.target)) {
        // focus the contenteditable element
        contentEditableEl.focus();
      }
    });

    /* Simulate the console being used
    /* ====================================================================== */

    runInput('ls', { speed: 100, beforeMs: 1000, afterMs: 1000 })
    .then(() => runHtml('\n     <b>index.html</b>\n', { afterMs: 300 }))
    .then(() => runInput('we deploy', { speed: 60, afterMs: 1500 }))
    .then(() => runHtml('\n  >  <b>yourapp</b> in <b>wedeploy</b>', { afterMs: 100 }))
    .then(() => runHtml('\n     Initializing deployment process\n     Preparing package', { afterMs: 1500 }))
    .then(() => runHtml('\n  <b>!</b>  Deployment Successful in 3s', { afterMs: 200 }))
    .then(() => runHtml('\n  <b>!</b>  Deployed <b>hosting-yourapp.wedeploy.io</b>\n', { afterMs: 100 }))
    .then(() => runInput('', { isInteractive: true }));

    /* encodeHTML: return a string with encoded html entities
    /* ====================================================================== */

    function encodeHTML(string) {
      return document.createElement('x').appendChild(document.createTextNode(string)).parentNode.innerHTML;
    }

    /* display: show html in <pre> (attached as fragments)
    /* ====================================================================== */

    function pushHtml(html) {
      const sandboxEl = document.createElement('x');
      const fragmentEl = document.createDocumentFragment();

      sandboxEl.innerHTML = html;

      while (sandboxEl.lastChild) {
        fragmentEl.appendChild(sandboxEl.firstChild);
      }

      preEl.appendChild(fragmentEl);

      preEl.parentNode.scrollTop = preEl.parentNode.scrollHeight;
    }

    /* runHtml: promise html is shown, with a delay before and after
    /* ====================================================================== */

    function runHtml(content, rawopts) {
      const opts = Object(rawopts);

      return new Promise(resolve => setTimeout(resolve, opts.beforeMs || 0))
      .then(() => pushHtml(content))
      .then(() => new Promise(resolve => setTimeout(resolve, opts.afterMs || 0)));
    }

    /* runHtmlThenInput: promise html and a continuing interactive prompt
    /* ====================================================================== */

    function runHtmlThenInput(html) {
      // promise html is shown, then, promise a continuing interactive prompt
      return runHtml(html).then(() => runInput('', { isFocusInteractive: true }));
    }

    /* Run Input: Real or simulated console interaction
    /* ====================================================================== */

    function runInput(content, rawopts) {
      // get options
      const opts = Object(rawopts);

      return new Promise(resolve => {
        // display the current directory
        pushHtml('  <span>•</span>  /yoursite $ ');

        // create an input plaintext element
        const plaintextEl = preEl.appendChild(document.createElement('plaintext'));

        // if the plain text element is to be interactive
        if (opts.isInteractive || opts.isFocusInteractive) {
          // configure the plain text element as an input
          plaintextEl.setAttribute('contenteditable', true);
          plaintextEl.setAttribute('spellcheck', false);

          plaintextEl.addEventListener('keydown', onkeydown);
          plaintextEl.addEventListener('input', onInput);

          // // if the plain text element is to be focused
          // if (opts.isFocusInteractive) {
          //   // focus the input
            plaintextEl.focus();
          // }
        } else {
          // otherwise, simulate text being typed into the input
          malarkey(plaintextEl).pause(opts.beforeMs || 0).type(content, opts.speed || 0).pause(opts.afterMs || 0).call(resolve);
        }

        // on an input event, disable elements from being appended
        function onInput() {
          while (plaintextEl.lastElementChild) {
            plaintextEl.removeChild(plaintextEl.lastElementChild);
          }
        }

        // on a keydown event, manage various commands
        function onkeydown(event) {
          if (event.metaKey && K_KEY_CODE === event.keyCode) {
            // CMD+K will clear the console
            runClearThenInput();
          } else if (RETURN_KEY_CODE === event.keyCode) {
            // otherwise, if the return key is pressed, cancel inputing return
            event.preventDefault();

            // disable the plain text element as an input
            plaintextEl.removeAttribute('contenteditable');
            plaintextEl.removeEventListener('keydown', onkeydown);

            // command parts from input inner text
            const cmd = getCommand(plaintextEl.innerText);

            switch (cmd.name) {
              case 'clear':
                runClearThenInput();
                break;
              case 'pwd':
                runPwdThenInput();
                break;
              case 'ls':
                runLsThenInput();
                break;
              case 'we':
                runWeThenInput(cmd.args);
                break;
              case 'cat':
                runCatThenInput();
                break;
              case 'echo':
                runEchoThenInput(cmd.args);
                break;
              case 'man':
                runOpenThenInput('/docs/');
                break;
              case 'open':
                runOpenThenInput(cmd.args);
                break;
              case 'cd':
              case 'cp':
              case 'find':
              case 'grep':
              case 'mkdir':
              case 'mv':
              case 'rm':
              case 'touch':
                runHtmlThenInput('\n');
                break;
              default:
                runHtmlThenInput(`\n     command not found: ${encodeHTML(cmd.name)}\n`);
            }
          }
        }
      })
    }

    /* getCommand: get the parts of a command
    /* ====================================================================== */

    function getCommand(string) {
      // regular expressions to match the different parts of a command
      const commandTrims = /^[\s;]+|[\s;]+$/g;
      const commandParts = /^(?:(sudo)\s+)?([^\s]+)?(?:\s+([\W\w]*))?$/;

      // input trimmed of spaces and semicolons
      const input = string.replace(commandTrims, '');

      // parts of a command
      const sudo = input.replace(commandParts, '$1');
      const name = input.replace(commandParts, '$2');
      const args = input.replace(commandParts, '$3');

      return { input, sudo, name, args };
    }

    /* runCatThenInput: show cat ascii
    /* ====================================================================== */

    function runCatThenInput() {
      // cat ascii
      const catAscii = [
        '',
        '      /\\_/\\',
        '     ( o.o )',
        '      > ^ <',
        ''
      ].join('\n');

      // show the cat ascii, then, promise a continuing interactive prompt
      return runHtmlThenInput(catAscii);
    }

    /* runClearThenInput: clear the <pre> of all children
    /* ====================================================================== */

    function runClearThenInput() {
      // promise all children are removed from <pre>
      return new Promise(resolve => {
        while (preEl.lastChild) {
          preEl.removeChild(preEl.lastChild);
        }

        resolve();
      })
      // then, promise a continuing interactive prompt
      .then(() => runInput('', { isFocusInteractive: true }));
    }

    /* runEcho: show any text in the console
    /* ====================================================================== */

    function runEcho(args) {
      // html that will display in the console
      const echoHTML = `\n     ${encodeHTML(args.replace(/^(["'])?([\W\w]*)\1$/, '$2'))}\n`;

      // echo the args, then, continue the interactive prompt
      runHtmlThenInput(echoHTML);
    }

    /* runOpenThenInput: open anything in a new tab
    /* ====================================================================== */

    function runOpenThenInput(args) {
      // if "open" is run, open anything from the args
      window.open(args, '_blank');

      // then, continue the interactive prompt
      return runHtmlThenInput('\n');
    }

    /* runPwdThenInput: show the files in the working directory
    /* ====================================================================== */

    function runLsThenInput() {
      return runHtmlThenInput('\n     <b>index.html</b>\n');
    }

    /* runPwdThenInput: show the working directory
    /* ====================================================================== */

    function runPwdThenInput() {
      return runHtmlThenInput('\n     <b>/yoursite</b>\n');
    }

    /* runWeThenInput: visit various we command documentation
    /* ====================================================================== */

    function runWeThenInput(args) {
      // we command documentation by index
      const cmdDocsByIndex = [
        null,
        null,
        'login',
        'logout',
        'deploy',
        'log',
        'domain',
        'env',
        'list',
        'delete',
        'console',
        'update'
      ];

      const cmdDocsIndex = cmdDocsByIndex.indexOf(args);
      const hasDocIndex  = args && cmdDocsIndex !== -1;

      // if a corresponding documentation is availabl
      if (hasDocIndex) {
        // show the documentation in a new tab
        window.open(`/docs/intro/using-the-command-line/#${cmdDocsIndex}`, '_blank');

        // then, continue the interactive prompt
        return runHtmlThenInput('\n');
      } else {
        // otherwise, show available "we" commands
        return runWeHelpThenInput();
      }
    }

    /* runWeHelpThenInput: show available we commands
    /* ====================================================================== */

    function runWeHelpThenInput() {
      // list the available we deploy commands
      return runHtmlThenInput([
        '',
        '  <span>!</span>   Usage: we [command] [flag]',
        '',
        '  Command         Description',
        '  <b>deploy</b>          Perform services deployment',
        '  <b>list</b>            Show list of projects and services',
        '  <b>console</b>         Open the console on your browser',
        '  <b>docs</b>            Open docs on your browser',
        '  <b>log</b>             Show logs of the services',
        '  <b>domain</b>          Show and configure domain names for services',
        '  <b>env</b>             Show and configure environment variables for services',
        '  <b>restart</b>         Restart project or services',
        '  <b>login</b>           Login into your account',
        '  <b>logout</b>          Logout from your account',
        '  <b>diagnostics</b>     Run system diagnostics and show report',
        '  <b>version</b>         Show CLI version',
        '  <b>update</b>          Update CLI to the latest version',
        '  <b>uninstall</b>       Uninstall CLI',
        '',
        '  Flag            Description',
        '  <b>-h</b>, <b>--help</b>      Show help message',
        '  <b>-v</b>, <b>--verbose</b>   Show more information about an operation',
        ''
      ].join('\n'));
    }
  }
}

Soy.register(TerminalComponent, templates);
export {TerminalComponent};
export default TerminalComponent;
