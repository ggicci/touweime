// How To Use Font Awesome 5 with React
// https://www.digitalocean.com/community/tutorials/how-to-use-font-awesome-5-with-react
// https://www.digitalocean.com/community/tutorials/react-font-awesome

import { config, dom, library } from '@fortawesome/fontawesome-svg-core'
import { faApple, faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faCat,
  faCloud,
  faCode,
  faCoffee,
  faColumns,
  faEnvelope,
  faFan,
  faFeatherAlt,
  faFireAlt,
  faKey,
  faSignInAlt,
  faToolbox,
  faUser,
  faWineBottle,
} from '@fortawesome/free-solid-svg-icons'

// https://github.com/FortAwesome/react-fontawesome#integrating-with-other-tools-and-frameworks
// Tell Font Awesome to skip adding the CSS automatically since it's being imported above
config.autoAddCss = true

library.add(
  faEnvelope,
  faKey,
  faToolbox,
  faFireAlt,
  faCoffee,
  faCode,
  faCat,
  faWineBottle,
  faFan,
  faFeatherAlt,
  faSignInAlt,
  faUser,
  faKey,
  faColumns,
  faCloud,
)

library.add(faGithub, faApple)

dom.watch()
