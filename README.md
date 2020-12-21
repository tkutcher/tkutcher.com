# tkutcher.com

Source code for https://tkutcher.com

[![pipeline status](https://gitlab.com/tkutcher/tkutcher-com/badges/master/pipeline.svg)](https://gitlab.com/tkutcher/tkutcher-com/-/commits/master)
![license](https://img.shields.io/github/license/tkutcher/tkutcher.com)
![angular version](https://img.shields.io/badge/Angular-11-red)
![lines](https://img.shields.io/tokei/lines/github/tkutcher/tkutcher.com)

- Deployed using S3 and AWS CloudFront
- Angular Universal for SSR and `angular-prerender` for the pre-rendering
- No tests cause eh
- Designed and Developed by me, if you'd like to use it as a starting point please credit
- Icons by FontAwesome (free kit)
- Mirrored on [GitLab](https://gitlab.com/tkutcher/tkutcher-com) for CD

---

### Development
- `ng serve` for development server
- `ng build --prod` for the standard build
- `ng run tkutcher-dot-com:server && npx angular-prerender` to do the SSR
