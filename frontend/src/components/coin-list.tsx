'use client'

import { Trans } from '@lingui/macro'
import dayjs from 'dayjs'
import { sum } from 'lodash-es'
import { Box, HStack, styled, VStack } from 'styled-system/jsx'

import { IfBreakpoint } from '@/components/if-breakpoint'
import { TextOverflowTooltip } from '@/components/text-overflow-tooltip'
import { Table, Text } from '@/components/ui'
import Link from '@/components/ui/link'
import { XudtLogoLoader } from '@/components/xudt-logo-loader'
import { DATE_TEMPLATE } from '@/constants'
import { RgbppCoinsQuery } from '@/gql/graphql'
import { formatNumber } from '@/lib/string/format-number'

type PickedCoin = Pick<
  RgbppCoinsQuery['rgbppCoins']['coins'][number],
  | 'typeHash'
  | 'icon'
  | 'symbol'
  | 'l1HoldersCount'
  | 'l2HoldersCount'
  | 'h24CkbTransactionsCount'
  | 'totalAmount'
  | 'decimal'
  | 'deployedAt'
>

// TestData todo
const testData = {
  marketCap: 0,
  volume24h: 0,
  circulatingSupply: 0,
  totalSupply: 0,
  price: 0,
}

export function CoinList<T extends PickedCoin>({ coins }: { coins: T[] }) {
  return (
    <IfBreakpoint breakpoint="lg" fallback={<CoinListGrid coins={coins} />}>
      <Table.Root w="100%" tableLayout="fixed">
        <Table.Head backgroundColor={'bg.input'}>
          <Table.Row>
            <Table.Header w="200px">
              <Trans>Coin</Trans>
            </Table.Header>
            <Table.Header w="100px">
              <Trans>Holders</Trans>
            </Table.Header>
            <Table.Header w="100px">
              <Trans>Price</Trans>
            </Table.Header>
            <Table.Header w="120px">
              <Trans>Txns(24H)</Trans>
            </Table.Header>
            <Table.Header w="120px">
              <Trans>Volume(24H)</Trans>
            </Table.Header>
            <Table.Header w="140px">
              <Trans>Circulating Supply</Trans>
            </Table.Header>
            <Table.Header w="140px">
              <Trans>Total Supply</Trans>
            </Table.Header>
            <Table.Header w="160px">
              <Trans>Market Cap</Trans>
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {coins.map((coin) => {
            return (
              <Table.Row key={coin.typeHash}>
                <Table.Cell>
                  <Link
                    href={`/assets/coins/${coin.typeHash}`}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    color="text.link"
                    cursor="pointer"
                  >
                    {coin.icon ? (
                      <styled.img w="32px" h="32px" src={coin.icon} rounded="100%" />
                    ) : (
                      <XudtLogoLoader symbol={coin.symbol} size={{ width: '32px', height: '32px',fontSize: '14px' }} />
                    )}
                    <TextOverflowTooltip label={coin.symbol}>
                      <Text maxW="200px" truncate cursor="pointer">
                        {coin.symbol}
                      </Text>
                    </TextOverflowTooltip>
                  </Link>
                </Table.Cell>
                <Table.Cell>{formatNumber(sum([coin.l1HoldersCount, coin.l2HoldersCount]))}</Table.Cell>
                <Table.Cell>${formatNumber(testData.price)}</Table.Cell>
                <Table.Cell>{formatNumber(coin.h24CkbTransactionsCount)}</Table.Cell>
                <Table.Cell>${formatNumber(testData.volume24h)}</Table.Cell>
                <Table.Cell>{formatNumber(coin.totalAmount, coin.decimal)}</Table.Cell>
                <Table.Cell>{formatNumber(coin.totalAmount, coin.decimal)}</Table.Cell>
                <Table.Cell>${formatNumber(testData.marketCap)}</Table.Cell>
                {/* <Table.Cell>{coin.deployedAt ? dayjs(coin.deployedAt).format(DATE_TEMPLATE) : '-'}</Table.Cell>*/}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </IfBreakpoint>
  )
}

export function CoinListGrid<T extends PickedCoin>({ coins }: { coins: T[] }) {
  return (
    <VStack gap={0} w="100%">
      {coins.map((coin) => {
        return (
          <Link
            href={`/assets/coins/${coin.typeHash}`}
            display="grid"
            w="100%"
            gap="16px"
            gridTemplateColumns="repeat(2, 1fr)"
            key={coin.typeHash}
            p="20px"
            borderBottom="1px solid"
            borderBottomColor="border.primary"
            _hover={{
              bg: 'bg.card.hover',
            }}
          >
            <HStack w="100%" gridColumn="1/3" color="brand">
              {coin.icon ? (
                <styled.img w="32px" h="32px" src={coin.icon} rounded="100%" />
              ) : (
                <XudtLogoLoader symbol={coin.symbol} size={{ width: '32px', height: '32px',fontSize: '14px' }} />
              )}
              <TextOverflowTooltip label={coin.symbol}>
                <Text maxW="200px" truncate cursor="pointer">
                  {coin.symbol}
                </Text>
              </TextOverflowTooltip>
            </HStack>
            {[
              {
                label: <Trans>Holders</Trans>,
                value: formatNumber(sum([coin.l1HoldersCount, coin.l2HoldersCount])),
              },
              {
                label: <Trans>Price</Trans>,
                value: '$' + formatNumber(testData.price),
              },
              {
                label: <Trans>Txns(24H)</Trans>,
                value: formatNumber(coin.h24CkbTransactionsCount),
              },
              {
                label: <Trans>Volume(24H)</Trans>,
                value: '$' + formatNumber(testData.volume24h),
              },
              {
                label: <Trans>Circulating Supply</Trans>,
                value: formatNumber(coin.totalAmount, coin.decimal),
              },
              {
                label: <Trans>Total Supply</Trans>,
                value: formatNumber(coin.totalAmount, coin.decimal),
              },
              {
                label: <Trans>Market Cap</Trans>,
                value: '$' + formatNumber(testData.marketCap),
              },
              {
                label: <Trans>Deploy Time</Trans>,
                value: coin.deployedAt ? dayjs(coin.deployedAt).format(DATE_TEMPLATE) : '-',
              },
            ].map((x, i) => {
              return (
                <VStack fontSize="14px" w="100%" alignItems="start" fontWeight="medium" key={i} gap="4px">
                  <Box color="text.third">{x.label}</Box>
                  <Box>{x.value}</Box>
                </VStack>
              )
            })}
          </Link>
        )
      })}
    </VStack>
  )
}
