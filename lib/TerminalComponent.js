'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TerminalComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _metalComponent = require('metal-component');

var _metalComponent2 = _interopRequireDefault(_metalComponent);

var _malarkey = require('malarkey');

var _malarkey2 = _interopRequireDefault(_malarkey);

var _metalSoy = require('metal-soy');

var _metalSoy2 = _interopRequireDefault(_metalSoy);

var _TerminalComponentSoy = require('./TerminalComponent.soy.js');

var _TerminalComponentSoy2 = _interopRequireDefault(_TerminalComponentSoy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This component simulates a terminal running the wedeploy cli.
 */
var TerminalComponent = function (_Component) {
  _inherits(TerminalComponent, _Component);

  function TerminalComponent() {
    _classCallCheck(this, TerminalComponent);

    return _possibleConstructorReturn(this, (TerminalComponent.__proto__ || Object.getPrototypeOf(TerminalComponent)).apply(this, arguments));
  }

  _createClass(TerminalComponent, [{
    key: 'attached',
    value: function attached() {
      this.console();
    }
  }, {
    key: 'console',
    value: function console() {
      /* Key codes
      /* ====================================================================== */

      var RETURN_KEY_CODE = 13;
      var K_KEY_CODE = 75;

      /* Initialize the console
      /* ====================================================================== */

      var preEl = document.querySelector('.start-demo-content pre');

      var consoleEl = preEl.parentElement.parentElement;

      /* Activate content-editable areas on click
      /* ====================================================================== */

      consoleEl.addEventListener('click', function (event) {
        // contenteditable element within the console
        var contentEditableEl = preEl.querySelector('[contenteditable]');

        // if the contenteditable element exists and is not already being clicked into
        if (contentEditableEl && !contentEditableEl.contains(event.target)) {
          // focus the contenteditable element
          contentEditableEl.focus();
        }
      });

      /* Simulate the console being used
      /* ====================================================================== */

      runInput('ls', { speed: 100, beforeMs: 1000, afterMs: 1000 }).then(function () {
        return runHtml('\n     <b>index.html</b>\n', { afterMs: 300 });
      }).then(function () {
        return runInput('we deploy', { speed: 60, afterMs: 1500 });
      }).then(function () {
        return runHtml('\n  >  <b>yourapp</b> in <b>wedeploy</b>', { afterMs: 100 });
      }).then(function () {
        return runHtml('\n     Initializing deployment process\n     Preparing package', { afterMs: 1500 });
      }).then(function () {
        return runHtml('\n  <b>!</b>  Deployment Successful in 3s', { afterMs: 200 });
      }).then(function () {
        return runHtml('\n  <b>!</b>  Deployed <b>hosting-yourapp.wedeploy.io</b>\n', { afterMs: 100 });
      }).then(function () {
        return runInput('', { isInteractive: true });
      });

      /* encodeHTML: return a string with encoded html entities
      /* ====================================================================== */

      function encodeHTML(string) {
        return document.createElement('x').appendChild(document.createTextNode(string)).parentNode.innerHTML;
      }

      /* display: show html in <pre> (attached as fragments)
      /* ====================================================================== */

      function pushHtml(html) {
        var sandboxEl = document.createElement('x');
        var fragmentEl = document.createDocumentFragment();

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
        var opts = Object(rawopts);

        return new Promise(function (resolve) {
          return setTimeout(resolve, opts.beforeMs || 0);
        }).then(function () {
          return pushHtml(content);
        }).then(function () {
          return new Promise(function (resolve) {
            return setTimeout(resolve, opts.afterMs || 0);
          });
        });
      }

      /* runHtmlThenInput: promise html and a continuing interactive prompt
      /* ====================================================================== */

      function runHtmlThenInput(html) {
        // promise html is shown, then, promise a continuing interactive prompt
        return runHtml(html).then(function () {
          return runInput('', { isFocusInteractive: true });
        });
      }

      /* Run Input: Real or simulated console interaction
      /* ====================================================================== */

      function runInput(content, rawopts) {
        // get options
        var opts = Object(rawopts);

        return new Promise(function (resolve) {
          // display the current directory
          pushHtml('  <span>•</span>  /yoursite $ ');

          // create an input plaintext element
          var plaintextEl = preEl.appendChild(document.createElement('plaintext'));

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
            (0, _malarkey2.default)(plaintextEl).pause(opts.beforeMs || 0).type(content, opts.speed || 0).pause(opts.afterMs || 0).call(resolve);
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
              var cmd = getCommand(plaintextEl.innerText);

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
                  runHtmlThenInput('\n     command not found: ' + encodeHTML(cmd.name) + '\n');
              }
            }
          }
        });
      }

      /* getCommand: get the parts of a command
      /* ====================================================================== */

      function getCommand(string) {
        // regular expressions to match the different parts of a command
        var commandTrims = /^[\s;]+|[\s;]+$/g;
        var commandParts = /^(?:(sudo)\s+)?([^\s]+)?(?:\s+([\W\w]*))?$/;

        // input trimmed of spaces and semicolons
        var input = string.replace(commandTrims, '');

        // parts of a command
        var sudo = input.replace(commandParts, '$1');
        var name = input.replace(commandParts, '$2');
        var args = input.replace(commandParts, '$3');

        return { input: input, sudo: sudo, name: name, args: args };
      }

      /* runCatThenInput: show cat ascii
      /* ====================================================================== */

      function runCatThenInput() {
        // cat ascii
        var catAscii = ['', '      /\\_/\\', '     ( o.o )', '      > ^ <', ''].join('\n');

        // show the cat ascii, then, promise a continuing interactive prompt
        return runHtmlThenInput(catAscii);
      }

      /* runClearThenInput: clear the <pre> of all children
      /* ====================================================================== */

      function runClearThenInput() {
        // promise all children are removed from <pre>
        return new Promise(function (resolve) {
          while (preEl.lastChild) {
            preEl.removeChild(preEl.lastChild);
          }

          resolve();
        })
        // then, promise a continuing interactive prompt
        .then(function () {
          return runInput('', { isFocusInteractive: true });
        });
      }

      /* runEcho: show any text in the console
      /* ====================================================================== */

      function runEcho(args) {
        // html that will display in the console
        var echoHTML = '\n     ' + encodeHTML(args.replace(/^(["'])?([\W\w]*)\1$/, '$2')) + '\n';

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
        var cmdDocsByIndex = [null, null, 'login', 'logout', 'deploy', 'log', 'domain', 'env', 'list', 'delete', 'console', 'update'];

        var cmdDocsIndex = cmdDocsByIndex.indexOf(args);
        var hasDocIndex = args && cmdDocsIndex !== -1;

        // if a corresponding documentation is availabl
        if (hasDocIndex) {
          // show the documentation in a new tab
          window.open('/docs/intro/using-the-command-line/#' + cmdDocsIndex, '_blank');

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
        return runHtmlThenInput(['', '  <span>!</span>   Usage: we [command] [flag]', '', '  Command         Description', '  <b>deploy</b>          Perform services deployment', '  <b>list</b>            Show list of projects and services', '  <b>console</b>         Open the console on your browser', '  <b>docs</b>            Open docs on your browser', '  <b>log</b>             Show logs of the services', '  <b>domain</b>          Show and configure domain names for services', '  <b>env</b>             Show and configure environment variables for services', '  <b>restart</b>         Restart project or services', '  <b>login</b>           Login into your account', '  <b>logout</b>          Logout from your account', '  <b>diagnostics</b>     Run system diagnostics and show report', '  <b>version</b>         Show CLI version', '  <b>update</b>          Update CLI to the latest version', '  <b>uninstall</b>       Uninstall CLI', '', '  Flag            Description', '  <b>-h</b>, <b>--help</b>      Show help message', '  <b>-v</b>, <b>--verbose</b>   Show more information about an operation', ''].join('\n'));
      }
    }
  }]);

  return TerminalComponent;
}(_metalComponent2.default);

_metalSoy2.default.register(TerminalComponent, _TerminalComponentSoy2.default);
exports.TerminalComponent = TerminalComponent;
exports.default = TerminalComponent;