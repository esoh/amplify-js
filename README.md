1. `yarn setup-dev` (may fail on last step)
1. `cd packages/auth`
1. `yarn build`

```
rm -rf ~/ws/fitzpo/mobile/node_modules/@aws-amplify/auth/src && cp -r ./src ~/ws/fitzpo/mobile/node_modules/@aws-amplify/auth/; \
rm -rf ~/ws/fitzpo/mobile/node_modules/@aws-amplify/auth/dist && cp -r ./dist ~/ws/fitzpo/mobile/node_modules/@aws-amplify/auth/; \
rm -rf ~/ws/fitzpo/mobile/node_modules/@aws-amplify/auth/lib && cp -r ./lib ~/ws/fitzpo/mobile/node_modules/@aws-amplify/auth/; \
rm -rf ~/ws/fitzpo/mobile/node_modules/@aws-amplify/auth/lib-esm && cp -r ./lib-esm ~/ws/fitzpo/mobile/node_modules/@aws-amplify/auth/;
```
